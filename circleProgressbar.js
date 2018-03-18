(function($){
	$.fn.circleProgressbar=function(options){
		$.fn.circleProgressbar.defaults={
			startAngle: 0,  //기본 시작 각도
			//endAngle:50,   //기본 끝 각도
			color:'#F90'   //기본 색상
		};

		var opts = $.extend({},$.fn.circleProgressbar.defaults,options);
		
		var percentage=this.html();
		var ID="c"+percentage+Math.random();

		this.append("<canvas id='"+ID+"'></canvas>");

		var canvas=document.getElementById(ID),
			context=canvas.getContext('2d');

		var Width = this.width();
		this.height(Width);
		var Height = this.height();

		canvas.width = Width;
		canvas.height = Height;

		var startAngle = opts.startAngle,
			endAngle = percentage/100,
			angle = startAngle,
			radius = Width*0.4;
		//트랙 그리기
		function drawTrackArc(){
			context.beginPath();
			context.strokeStyle = '#ECECEC';
			context.lineWidth = 5;
			context.arc(Width/2,Height/2,radius,(Math.PI/180)*(startAngle*360-90),(Math.PI/180)*(endAngle*360+270),false);
			context.stroke();
			context.closePath();
		}
		//바깥원 그리기
		function drawOuterArc(_angle,_color){
			var angle = _angle;
			var color = _color;
			context.beginPath();
			context.strokeStyle = color;
			context.lineWidth = 10;
			context.arc(Width/2,Height/2,radius,(Math.PI / 180) * (startAngle * 360 - 90), (Math.PI / 180) * (angle * 360 - 90), false);
	       	context.stroke();
	       	context.closePath();
		}	
		//돌아 가는 각도 계산
		function numOfPercentage(_angle,_color){
			var angle = Math.floor(_angle*100)+1;
			var color=_color;
			context.font = "50px fantasy";
			context.fillStyle = color;
			var metrics = context.measureText(angle);
			var textWidth = metrics.width;
			var xPos = Width/2-textWidth/2,
				yPos = Height/2+textWidth/2;
			context.fillText(angle+"%",xPos,yPos);
		}

		//그리기 모션
		function draw(){
			var loop = setInterval(function(){
				context.clearRect(0,0,Width,Height);
				drawTrackArc();
				drawOuterArc(angle,opts.color);
				numOfPercentage(angle,opts.color);
				angle+=0.01;
				if(angle>endAngle){
					clearInterval(loop);
				}

			},1000/60);
		}
		draw();
		return this;
	};
})(jQuery);
