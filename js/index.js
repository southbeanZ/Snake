var board = document.getElementById('board'),
		startBtn = document.getElementById('btn_start'),
		stopBtn = document.getElementById('btn_stop'),
		endBtn = document.getElementById('btn_end'),
		ctx = board.getContext('2d');
var raf = null,
		timer = null;

/*
 * 绘制场地
 */
var Painter = {
	view: function(w, h) {
		var col = w / 20,
				row = h / 20;
		ctx.strokeStyle = '#BFBFBF';
		for(var i = 0; i <= row; i++) {
			ctx.moveTo(0, i*20);
			ctx.lineTo(w, i*20);
			ctx.stroke();
		}
		for(var i = 0; i <= col; i++) {
			ctx.moveTo(i*20, 0);
			ctx.lineTo(i*20, h);
			ctx.stroke();
		}
	}
}

var Snake = {
	x: -20,
	y: 0,
	len: 2,
	vx: 1,
	vy: 0,
	view: function() {
		ctx.fillStyle = '#000';
		ctx.fillRect(this.x + this.vx * 20, this.y, this.len * 20, 20);
		this.x += this.vx * 20;
	}
}

function move() {
	ctx.clearRect(0, 0, 600, 400);
	Painter.view(600, 400);
	Snake.view();
	timer = setTimeout(function() {
		raf = window.requestAnimationFrame(move);
	}, 800);
}


var page = {
	init: function() {
		this.view();
		this.listen();
	},
	view: function() {
		Painter.view(600, 400);
		Snake.view();
	},
	listen: function() {
		startBtn.addEventListener('click', function() {
			move();
		}, false);
		stopBtn.addEventListener('click', function() {
			// window.cancelAnimationFrame(raf);
			clearTimeout(timer);
		}, false);
		endBtn.addEventListener('click', function() {
			clearTimeout(timer);
			alert('Game over!');
		}, false);
		window.addEventListener('keydown', function(e) {
			var key = e.keyCode || e.which;
			switch(key) {
				case 37: //左
					if(Snake.vx > 0) {
						Snake.vx = -Snake.vx;
					}
					break;
				case 38: //上
					break;
				case 39: //右
					if(Snake.vx < 0) {
						Snake.vx = -Snake.vx;
					}
					break;
				case 40: //下
					break;
				default:
					;
			}
		})
	}
}

page.init();