var board = document.getElementById('board'),
		background = document.getElementById('back'),
		startBtn = document.getElementById('btn_start'),
		stopBtn = document.getElementById('btn_stop'),
		endBtn = document.getElementById('btn_end'),
		replayBtn = document.getElementById('btn_replay'),
		ctx = board.getContext('2d'),
		ctxBack = background.getContext('2d');
var raf = null,
		timer = null,
		canvasW = board.width,
		canvasH = board.height,
		timeGap = 800;

/*
 * 绘制场地
 */
var Painter = {
	col: 0,
	row: 0,
	view: function(w, h) {
		this.col = w / 20,
		this.row = h / 20;
		ctxBack.strokeStyle = '#BFBFBF';
		for(var i = 0; i <= this.row; i++) {
			ctxBack.moveTo(0, i*20);
			ctxBack.lineTo(w, i*20);
			ctxBack.stroke();
		}
		for(var i = 0; i <= this.col; i++) {
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
	tagArr: null,
	isEat: false,
	init: function() {
		this.tagArr = new Array();
		for(var i = 0; i < Painter.col; i++) {
				this.tagArr[i] = new Array();
			for(var j = 0; j < Painter.row; j++) {
				this.tagArr[i][j] = 0;
			}
		}
		ctx.fillStyle = '#000';
		this.posArr.forEach((_e, _i) => {
			this.tagArr[_e[0] / 20][_e[1] / 20] = 1;
			ctx.fillRect(_e[0], _e[1], 20, 20);
		})
	},
	view: function() {
		var head = this.posArr[0],
				tail = this.posArr[this.posArr.length - 1];
		ctx.fillStyle = '#000';
		this.tagArr[head[0] / 20][head[1] / 20] = 1;
		ctx.fillRect(head[0], head[1], 20, 20);
		if(!Snake.isEat) {
			this.posArr.pop();
			this.tagArr[tail[0] / 20][tail[1] / 20] = 0;
			ctx.clearRect(tail[0], tail[1], 20, 20);
		}
		Snake.isEat = false;
	},
	reset: function() {
		this.vx = 20;
		this.vy = 0;
		this.dir = 'right';
		this.posArr = [
			[20, 0],
			[0, 0]
		];
		ctx.clearRect(0, 0, canvasW, canvasH);
		this.init();
	}
}

var Food = {
	tagArr: null,
	init: function() {
		this.tagArr = new Array();
		for(var i = 0; i < Painter.col; i++) {
				this.tagArr[i] = new Array();
			for(var j = 0; j < Painter.row; j++) {
				this.tagArr[i][j] = 0;
			}
		}
	},
	view: function() {
		var i = Math.floor(Math.random() * Painter.row),
				j = Math.floor(Math.random() * Painter.col);
		var pos = [i, j];
		if(Snake.tagArr[i][j] || this.tagArr[i][j]) {
			this.view();
			return ;
		} else {
			this.tagArr[i][j] = 1;
			ctx.fillStyle = '#ddb146';
			ctx.fillRect(i * 20, j * 20, 20, 20);
		}
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
	if(x > canvasW - 20 || x < 0 || y > canvasH - 20 || y < 0) {
		alert('Game over');
		return ;
	}
	if(Food.tagArr[x / 20][y / 20]) {
		Snake.isEat = true;
		Food.tagArr[x / 20][y / 20] = 0;
	}
	Snake.posArr.unshift([x, y]);
	Snake.view();
	timer = setTimeout(function() {
		move();
	}, timeGap);
}


var page = {
	init: function() {
		this.view();
		this.listen();
	},
	view: function() {
		Painter.view(canvasW, canvasH);
		Snake.init();
		Food.init();
		Food.view();
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
		replayBtn.addEventListener('click', function() {
			clearTimeout(timer);
			Snake.reset();
		})
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