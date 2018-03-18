/* Sample */
(function($) {
  /*    적용 방법 1 - 애니메이션 없음, 두 가지 색 그라디언트  */
  $('.first.circle').circleProgress({
    value: 0.35,
    animation: false,
    fill: {gradient: ['#ff1e41', '#ff5f43']}
  });

  /*  적용 방법 2 - 기본 애니메이션, 100% 회전 */
  $('.second.circle').circleProgress({
    value: 0.6
  }).on('circle-animation-progress', function(event, progress) {
    $(this).find('strong').html(Math.round(100 * progress) + '<i>%</i>');
  });

  /* 적용 방법 3 - 사용자 지정 그라디언트, 75% 회전 사용자 지정   */
  $('.third.circle').circleProgress({
    value: 0.75,
    fill: {gradient: [['#0681c4', .5], ['#4ac5f8', .5]], gradientAngle: Math.PI / 4}
  }).on('circle-animation-progress', function(event, progress, stepValue) {
    $(this).find('strong').text(stepValue.toFixed(2).substr(1));
  });

  /* 적용 방법 4 - 단색 지정, 시작 각도 사용자 지정, 선 모양 사용자 지정  */
  var c4 = $('.forth.circle');

  c4.circleProgress({
    startAngle: -Math.PI / 4 * 3,
    value: 0.5,
    lineCap: 'round',
    fill: {color: '#ffa500'}
  });

  // 동적 값 및 시간 재지정
  setTimeout(function() { c4.circleProgress('value', 0.7); }, 1000);
  setTimeout(function() { c4.circleProgress('value', 1.0); }, 1100);
  setTimeout(function() { c4.circleProgress('value', 0.5); }, 2100);

  /* 적용 방법 5 - 사용자 지정 : 이미지, 사이즈, 두께, 애니메이션, 각도 */
  $('.fifth.circle').circleProgress({
    value: 0.7
  });
})(jQuery);
