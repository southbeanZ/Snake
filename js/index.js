var board = document.getElementById('board'),
		background = document.getElementById('back'),
		startBtn = document.getElementById('btn_start'),
		stopBtn = document.getElementById('btn_stop'),
		endBtn = document.getElementById('btn_end'),
		ctx = board.getContext('2d'),
		ctxBack = background.getContext('2d');
var raf = null,
		timer = null;

/*
 * 绘制场地
 */
var Painter = {
	view: function(w, h) {
		var col = w / 20,
				row = h / 20;
		ctxBack.strokeStyle = '#BFBFBF';
		for(var i = 0; i <= row; i++) {
			ctxBack.moveTo(0, i*20);
			ctxBack.lineTo(w, i*20);
			ctxBack.stroke();
		}
		for(var i = 0; i <= col; i++) {
			ctxBack.moveTo(i*20, 0);
			ctxBack.lineTo(i*20, h);
			ctxBack.stroke();
		}
	}
}

var Snake = {
	vx: 20,
	vy: 0,
	dir: 'right',
	posArr: [ //记录每一节位置
		[20, 0],
		[0, 0]
	],
	init: function() {
		ctx.fillStyle = '#000';
		this.posArr.forEach((_e, _i) => {
			ctx.fillRect(_e[0], _e[1], 20, 20);
		})
	},
	view: function() {
		var head = this.posArr[0],
				tail = this.posArr[this.posArr.length - 1];
		this.posArr.pop();
		ctx.fillRect(head[0], head[1], 20, 20);
		ctx.clearRect(tail[0], tail[1], 20, 20);
	}
}

function move() {
	var x = Snake.posArr[0][0],
			y = Snake.posArr[0][1];
	if(Snake.vy != 0) {
		y += Snake.vy;
	} else if (Snake.vx != 0) {
		x += Snake.vx;
	}
	Snake.posArr.unshift([x, y]);
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
		Snake.init();
		Painter.view(600, 400);
	},
	listen: function() {
		startBtn.addEventListener('click', function() {
			move();
		}, false);
		stopBtn.addEventListener('click', function() {
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
					if (Snake.vx == 0) {
						Snake.vx = -20;
					}
					Snake.vy = 0;
					break;
				case 38: //上
					if (Snake.vy == 0) {
						Snake.vy = -20;
					}
					Snake.vx = 0;
					break;
				case 39: //右
					if (Snake.vx == 0) {
						Snake.vx = 20;
					}
					Snake.vy = 0;
					break;
				case 40: //下
					if (Snake.vy == 0) {
						Snake.vy = 20;
					}
					Snake.vx = 0;
					break;
				default:
					;
			}
		})
	}
}

page.init();