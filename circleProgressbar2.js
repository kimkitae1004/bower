(function($){

function circleProgressbar2($obj, options) {
  var defaults = {
    "inline": true,   //인라인 방식 삽입 여부 기본값
    "font-size": 40,  //글자 사이즈 기본값
    "font-family": "Helvetica, Arial, sans-serif", //폰트 기본값
    "text-color": null,  //글자색 기본값
    "lines": 1,      // 라인 수 기본값
    "line": 0,      //시작라인 기본값
    "symbol": "",   //심볼
    "margin": 0,    //마진 기본값
    "color": "rgb(55,123,181)",  //차트의 계열 색상 기본값
    "background": "rgba(0,0,0,0.1)", //배경색상 기본값
    "size": $obj.outerWidth(),     //사이즈 기본값
    "fill": "5px",         //채워지는 선의 두께 기본값
    "range": [0, 100]   //채워지는 각도 기본값
  };
  this.options = $.extend(defaults, options);  //옵션 지정이 없을 경우 기본값 적용

  this.first_rot_base = -135;
  this.second_rot_base = -315;

  //만약 옵션 지정이 있다면 옵션 불러오기
  this.options['size'] = parseInt(this.options['size'], 10);
  this.options['fill'] = parseInt(this.options['fill'], 10);
  this.options['font-size'] = parseInt(this.options['font-size'], 10);
  this.options['margin'] = Math.max(0, parseInt(this.options['margin'], 10));
  this.options['text-color'] = this.options['text-color'] || this.options['color'];

  //객체에 대한 서식 설정
  $obj.css({
    "position": "relative",
    "width": this.options['size'],
    "height": this.options['size'],
    "display": this.options['inline'] ? "inline-block" : "block"
  });

  this.$radialBackground = $("<div>").appendTo($obj).css({
    "box-sizing": "border-box",
    "-moz-box-sizing": "border-box",
    "-webkit-box-sizing": "border-box",
    "position": "absolute",
    "top": this.options['margin'],
    "left": this.options['margin'],
    "width": this.options['size'] - this.options['margin'] * 2,
    "height": this.options['size'] - this.options['margin'] * 2,
    "border": this.options['fill'] + "px solid " + this.options['background'],
    "border-radius": Math.ceil(this.options['size'] / 2) + "px",
  });

  this.$radialFirstHalfMask = $("<div>").appendTo($obj).css({
    "position": "absolute",
    "top": this.options['margin'],
    "right": this.options['margin'],
    "width": Math.round(this.options['size'] / 2) - this.options['margin'],
    "height": this.options['size'] - this.options['margin'] * 2,
    "overflow": "hidden"
  });

  this.$radialSecondHalfMask = $("<div>").appendTo($obj).css({
    "position": "absolute",
    "top": this.options['margin'],
    "left": this.options['margin'],
    "width": Math.round(this.options['size'] / 2) - this.options['margin'],
    "height": this.options['size'] - this.options['margin'] * 2,
    "overflow": "hidden"
  });

  this.$radialFirstHalf = $("<div>").appendTo(this.$radialFirstHalfMask).css({
    "box-sizing": "border-box",
    "-moz-box-sizing": "border-box",
    "-webkit-box-sizing": "border-box",
    "position": "absolute",
    "top": "0px",
    "border-width": this.options['fill'],
    "border-style": "solid",
    "border-color": this.options['color'] + " " + this.options['color'] + " transparent transparent",
    "width": "200%",
    "height": "100%",
    "border-radius": "50%",
    "left": "-100%",
    "transform": "rotate(" + this.first_rot_base + "deg)"
  });

  this.$radialSecondHalf = $("<div>").appendTo(this.$radialSecondHalfMask).css({
    "box-sizing": "border-box",
    "-moz-box-sizing": "border-box",
    "-webkit-box-sizing": "border-box",
    "position": "absolute",
    "top": "0px",
    "border-width": this.options['fill'],
    "border-style": "solid",
    "border-color": this.options['color'] + " " + this.options['color'] + " transparent transparent",
    "width": "200%",
    "height": "100%",
    "border-radius": "50%",
    "left": "0px",
    "transform": "rotate(" + this.second_rot_base + "deg)"
  });

  if (this.options['text-color']) {
    this.$radialLabel = $("<div>").appendTo($obj).css({
      "position": "absolute",
      "font-size": this.options['font-size'] + "px",
      "font-family": this.options['font-family'],
      "color": this.options['text-color'],
      "left": "50%",
      "top": "50%",
      "transform": "translate(-50%, -50%)"
    });
  }

  this.perc = 0;
  this.queue = [];
}

circleProgressbar2.prototype.toPerc = function(options) {
  var self = this,
      offset = options['offset'] || 0,
      interval_delay = 10,
      time = options['time'] || 1000,
      targetPerc = Math.max(0, Math.min(100, (options['perc'] - self.options['range'][0]) / (self.options['range'][1] - self.options['range'][0]) * 100)),
      diffPerc = targetPerc - this.perc,
      direction = diffPerc / Math.abs(diffPerc),
      step = diffPerc / (time / interval_delay);
  if (!this.animation) {
    this.animation = setInterval(function() {
      if ((direction > 0 && self.perc >= targetPerc) || (direction < 0 && self.perc <= targetPerc)) {
        window.clearInterval(self.animation);
        self.animation = null;
        var next = self.queue.shift();
        if (next) self.toPerc(next);
        return;
      }
      self.perc += step;
      var first_rot = self.first_rot_base;
      var second_rot = self.second_rot_base;
      if (self.perc < 50) {
        first_rot = self.first_rot_base + (self.perc / 50) * 180;
        second_rot = self.second_rot_base;
      } else {
        first_rot = self.first_rot_base + 1 * 180;
        second_rot = self.second_rot_base + ((self.perc - 50) / 50) * 180;
      }
      self.$radialFirstHalf.css({
        "transform": "rotate(" + first_rot + "deg)"
      });
      self.$radialSecondHalf.css({
        "transform": "rotate(" + second_rot + "deg)"
      });
      if (self.$radialLabel) {
        var value = targetPerc ? self.perc/targetPerc * (targetPerc - offset) : 0;
        value = self.options['range'][0] + value / 100 * (self.options['range'][1] - self.options['range'][0]);
        var text = Math.round(value + self.options['symbol']);
        for (var ti = 0; ti < self.options['line']; ti++) text = "&nbsp;<br>" + text;
        for (var ti = self.options['lines'] - (self.options['line'] + 1); ti > 0; ti--) text = text + "<br>&nbsp;";
        self.$radialLabel.html(text);
      }
    }, interval_delay);
  } else {
    this.queue.push(options);
  }
};

$.fn.circleProgressbar2 = function(func, options) {
  if (func === "init") {
    $(this).data("__circleProgressbar2", new circleProgressbar2($(this), options));
  } else if ($(this).data("__circleProgressbar2")) {
    if (func === "to") $(this).data("__circleProgressbar2").toPerc(options)
  }
  return this;
};

$.fn.radialPieChart = function(func, options) {
  if (func === "init") {
    var sum = options['data'].reduce(function(a, item) {
      return a + item.perc;
    }, 0);
    for (var i = 0; i < options['data'].length; i++) {
      $(this).data("__pieChartSegment" + i, new circleProgressbar2($(this), $.extend(options, options['data'][i], {'lines': options['data'].length, 'line': i })));
      $(this).data("__pieChartSegment" + i).toPerc({'perc': sum, 'offset': sum - options['data'][i].perc});
      sum -= options['data'][i].perc;
    }
  }
  return this;
};

$.fn.radialMultiProgress = function(func, options) {
  if (func === "init") {
    var space = options['space'] || 2,
        segmentFill = Math.floor(options['fill'] / options['data'].length) - space,
        margin = 0;
    for (var i = 0; i < options['data'].length; i++) {
      $(this).data("__multiProgress" + i, new circleProgressbar2($(this), $.extend(options, options['data'][i], {'fill': segmentFill, 'margin': margin, 'lines': options['data'].length, 'line': i })));
      margin += segmentFill + space;
    }
  }
  else if (options['index'] !== undefined) {
    if ($(this).data("__multiProgress" + options['index'])) {
      if (func === "to") $(this).data("__multiProgress" + options['index']).toPerc(options);
    }
  }
  else if (options['list'] !== undefined) {
    for (var i = 0; i < options['list'].length; i++) {
      if (func === "to") $(this).data("__multiProgress" + options['list'][i]['index']).toPerc(options['list'][i]);
    }
  }
  return this;
};

})(jQuery);
