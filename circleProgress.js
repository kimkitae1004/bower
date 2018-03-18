/* 2017.08.31 jquery-circle-progress Mr. kim */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    var $ = require('jquery');
    factory($);
    module.exports = $;
  } else {
    factory(jQuery);
  }
})(function($) {
  function CircleProgress(config) {
    this.init(config);
  }

  CircleProgress.prototype = {
    value: 0.0,

    /* 캔버스 px단위 크기, 기본값은 100.0임 */
    size: 100.0,

    /* 회전의 시각 각도 */
    startAngle: -Math.PI,

    /* 회전하는 원의 두께     */
    thickness: 'auto',

    /*
     호의 배경색 지정
     
        - 단색의 경우:
          - `'#3aeabb'`
          - `{ color: '#3aeabb' }`
          - `{ color: 'rgba(255, 255, 255, .3)' }`
        - 선형 그라디언트의 경우는 (왼쪽에서 오른쪽으로 색상 배치)
          - `{ gradient: ['#3aeabb', '#fdd250'], gradientAngle: Math.PI / 4 }`
          - `{ gradient: ['red', 'green', 'blue'], gradientDirection: [x0, y0, x1, y1] }`
          - `{ gradient: [["red", .2], ["green", .3], ["blue", .8]] }`
        - 이미지로 지정하는 경우
          - `{ image: 'http://i.imgur.com/pT0i89v.png' }`
          - `{ image: imageObject }`
          - `{ color: 'lime', image: 'circle.png' }` -
     */
    fill: {
      gradient: ['#3aeabb', '#fdd250']
    },

    /* 시작 전의 채움 색상 지정(단색만 지정 가능합니다.)     */
    emptyFill: 'rgba(0, 0, 0, .1)',

    /*     jQuery 애니메이션 설정     */
    animation: {
      duration: 1200,
      easing: 'circleProgressEasing'
    },

    /* 기본 애니메이션 시작 값 0.0~1.0     */
    animationStartValue: 0.0,

    /* 역방향 애니메이션 지정 */
    reverse: false,

    /* 호의 선 모양 butt/round/square 지정 가능     */
    lineCap: 'butt',

    /* 캔버스 삽입 모드 : - prepend 부모의 첫 요소로, - append 부모의 마지막 요소로   */
    insertMode: 'prepend',

    /* 링크 선택자 보호 */
    constructor: CircleProgress,

    /* jQuery 선택자 설정 및 보호     */
    el: null,

    /* 캔버스 선택자 설정 및 보호 */
    canvas: null,

    /* 2D-context 설정 및 보호 */
    ctx: null,

    /* 바깥원에 대한 반지름 지정 및 보호  */
    radius: 0.0,

    /* 호에 대한 채움 자동 계산과 모양 설정 및 보호 */
    arcFill: null,

    /* 마지막 모양 값에 대한 설정 및 보호    */
    lastFrameValue: 0.0,

    /* 초기화 설정 */
    init: function(config) {
      $.extend(this, config);
      this.radius = this.size / 2;
      this.initWidget();
      this.initFill();
      this.draw();
      this.el.trigger('circle-inited');
    },

    /* 캔버스 값 설정    */
    initWidget: function() {
      if (!this.canvas)
        this.canvas = $('<canvas>')[this.insertMode == 'prepend' ? 'prependTo' : 'appendTo'](this.el)[0];

      var canvas = this.canvas;
      canvas.width = this.size;
      canvas.height = this.size;
      this.ctx = canvas.getContext('2d');

      if (window.devicePixelRatio > 1) {
        var scaleBy = window.devicePixelRatio;
        canvas.style.width = canvas.style.height = this.size + 'px';
        canvas.width = canvas.height = this.size * scaleBy;
        this.ctx.scale(scaleBy, scaleBy);
      }
    },

    /* 호의 채움 색상 및 이미지 설정 */
    initFill: function() {
      var self = this,
        fill = this.fill,
        ctx = this.ctx,
        size = this.size;

      if (!fill)
        throw Error("The fill is not specified!");

      if (typeof fill == 'string')
        fill = {color: fill};

      if (fill.color)
        this.arcFill = fill.color;

      if (fill.gradient) {
        var gr = fill.gradient;

        if (gr.length == 1) {
          this.arcFill = gr[0];
        } else if (gr.length > 1) {
          var ga = fill.gradientAngle || 0, // 그라디언의 진행 각도
            gd = fill.gradientDirection || [
                size / 2 * (1 - Math.cos(ga)), // x0
                size / 2 * (1 + Math.sin(ga)), // y0
                size / 2 * (1 + Math.cos(ga)), // x1
                size / 2 * (1 - Math.sin(ga))  // y1
              ];

          var lg = ctx.createLinearGradient.apply(ctx, gd);

          for (var i = 0; i < gr.length; i++) {
            var color = gr[i],
              pos = i / (gr.length - 1);

            if ($.isArray(color)) {
              pos = color[1];
              color = color[0];
            }

            lg.addColorStop(pos, color);
          }

          this.arcFill = lg;
        }
      }

      if (fill.image) {
        var img;

        if (fill.image instanceof Image) {
          img = fill.image;
        } else {
          img = new Image();
          img.src = fill.image;
        }

        if (img.complete)
          setImageFill();
        else
          img.onload = setImageFill;
      }

      function setImageFill() {
        var bg = $('<canvas>')[0];
        bg.width = self.size;
        bg.height = self.size;
        bg.getContext('2d').drawImage(img, 0, 0, size, size);
        self.arcFill = self.ctx.createPattern(bg, 'no-repeat');
        self.drawFrame(self.lastFrameValue);
      }
    },

    /* 그려지는 원의 값 전달 */
    draw: function() {
      if (this.animation)
        this.drawAnimated(this.value);
      else
        this.drawFrame(this.value);
    },

    /* 그려지는 애니메이션 프레임 생성 */
    drawFrame: function(v) {
      this.lastFrameValue = v;
      this.ctx.clearRect(0, 0, this.size, this.size);
      this.drawEmptyArc(v);
      this.drawArc(v);
    },

    /* 그려지는 호의 반지름, 선두께, 시작각도 값 전달 */
    drawArc: function(v) {
      if (v === 0)
        return;

      var ctx = this.ctx,
        r = this.radius,
        t = this.getThickness(),
        a = this.startAngle;

      ctx.save();
      ctx.beginPath();

      if (!this.reverse) {
        ctx.arc(r, r, r - t / 2, a, a + Math.PI * 2 * v);
      } else {
        ctx.arc(r, r, r - t / 2, a - Math.PI * 2 * v, a);
      }

      ctx.lineWidth = t;
      ctx.lineCap = this.lineCap;
      ctx.strokeStyle = this.arcFill;
      ctx.stroke();
      ctx.restore();
    },

    /* 비어있는 원호에 대한 반지름, 선두께, 시작각도 값 전달 */
    drawEmptyArc: function(v) {
      var ctx = this.ctx,
        r = this.radius,
        t = this.getThickness(),
        a = this.startAngle;

      if (v < 1) {
        ctx.save();
        ctx.beginPath();

        if (v <= 0) {
          ctx.arc(r, r, r - t / 2, 0, Math.PI * 2);
        } else {
          if (!this.reverse) {
            ctx.arc(r, r, r - t / 2, a + Math.PI * 2 * v, a);
          } else {
            ctx.arc(r, r, r - t / 2, a, a - Math.PI * 2 * v);
          }
        }

        ctx.lineWidth = t;
        ctx.strokeStyle = this.emptyFill;
        ctx.stroke();
        ctx.restore();
      }
    },

    /* 프로그레스바의 3가지 이벤트 설정 
     - circle-animation-start(jqEvent)
     - circle-animation-progress(jqEvent, animationProgress, stepValue) 
        multiple event
        animationProgress: from `0.0` to `1.0`;
        stepValue: from `0.0` to `value`
     - circle-animation-end(jqEvent)
     */
    drawAnimated: function(v) {
      var self = this,
        el = this.el,
        canvas = $(this.canvas);

      // 시작 애니메이션 트리거
      canvas.stop(true, false);
      el.trigger('circle-animation-start');

      canvas
        .css({animationProgress: 0})
        .animate({animationProgress: 1}, $.extend({}, this.animation, {
          step: function(animationProgress) {
            var stepValue = self.animationStartValue * (1 - animationProgress) + v * animationProgress;
            self.drawFrame(stepValue);
            el.trigger('circle-animation-progress', [animationProgress, stepValue]);
          }
        }))
        .promise()
        .always(function() {
          // 종료 애니메이션 트리거
          el.trigger('circle-animation-end');
        });
    },

    /* 원의 두께 계산 */
    getThickness: function() {
      return $.isNumeric(this.thickness) ? this.thickness : this.size / 14;
    },

    /* 현재 진행되고 있는 값 계산 및 전달     */
    getValue: function() {
      return this.value;
    },

    /* 애니메이션 또는 트랜지션 값과 시간 계산    */
    setValue: function(newValue) {
      if (this.animation)
        this.animationStartValue = this.lastFrameValue;
      this.value = newValue;
      this.draw();
    }
  };

  $.circleProgress = {
    // Default options (you may override them)
    defaults: CircleProgress.prototype
  };

  // 애니메이션 가감속 효과
  $.easing.circleProgressEasing = function(x, t, b, c, d) {
    if ((t /= d / 2) < 1)
      return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  };

  /* 메인에서의 circleProgress 사용 방법
    { value: 0.75, size: 50, animation: false }

   메서드 옵션 설정법:
    el.circleProgress('widget'); // 캔버스 선택자 지정
    el.circleProgress('value'); // 값 지정
    el.circleProgress('value', newValue); // 바뀌는 값 지정
    el.circleProgress('redraw'); // 다시 그려지는 옵션 값 지정
    el.circleProgress(); 
  */
  $.fn.circleProgress = function(configOrCommand, commandArgument) {
    var dataName = 'circle-progress',
      firstInstance = this.data(dataName);

    if (configOrCommand == 'widget') {
      if (!firstInstance)
        throw Error('Calling "widget" method on not initialized instance is forbidden');
      return firstInstance.canvas;
    }

    if (configOrCommand == 'value') {
      if (!firstInstance)
        throw Error('Calling "value" method on not initialized instance is forbidden');
      if (typeof commandArgument == 'undefined') {
        return firstInstance.getValue();
      } else {
        var newValue = arguments[1];
        return this.each(function() {
          $(this).data(dataName).setValue(newValue);
        });
      }
    }

    return this.each(function() {
      var el = $(this),
        instance = el.data(dataName),
        config = $.isPlainObject(configOrCommand) ? configOrCommand : {};

      if (instance) {
        instance.init(config);
      } else {
        var initialConfig = $.extend({}, el.data());
        if (typeof initialConfig.fill == 'string')
          initialConfig.fill = JSON.parse(initialConfig.fill);
        if (typeof initialConfig.animation == 'string')
          initialConfig.animation = JSON.parse(initialConfig.animation);
        config = $.extend(initialConfig, config);
        config.el = el;
        instance = new CircleProgress(config);
        el.data(dataName, instance);
      }
    });
  };
});