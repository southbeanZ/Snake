var board = document.getElementById('board'),
		background = document.getElementById('back'),
		startBtn = document.getElementById('btn_start'),
		continueBtn = document.getElementById('btn_continue'),
		stopBtn = document.getElementById('btn_stop'),
		endBtn = document.getElementById('btn_end'),
		replayBtn = document.getElementById('btn_replay'),
		gameType = document.getElementById('game_type'),
		ctx = board.getContext('2d'),
		ctxBack = background.getContext('2d');
var timer = null,
		canvasW = board.width,
		canvasH = board.height;

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
	vx: 1,
	vy: 0,
	timeGap: 800,
	dir: 'right',
	posArr: [ //记录每一节位置
		[1, 0],
		[0, 0]
	],
	tagArr: null, //记录游戏区每一格占据信息
	isEat: false,
	step: 0,
	counter: 0,
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
			this.tagArr[_e[1]][_e[0]] = 1;
			ctx.fillRect(_e[0] * 20, _e[1] * 20, 20, 20);
		})
	},
	view: function() {
		var head = this.posArr[0],
				tail = this.posArr[this.posArr.length - 1];
		ctx.fillStyle = '#000';
		this.tagArr[head[1]][head[0]] = 1;
		ctx.fillRect(head[0] * 20, head[1] * 20, 20, 20);
		if(!this.isEat) {
			this.posArr.pop();
			this.tagArr[tail[1]][tail[0]] = 0;
			ctx.clearRect(tail[0] * 20, tail[1] * 20, 20, 20);
		}
		this.isEat = false;
	},
	reset: function() {
		this.vx = 1;
		this.vy = 0;
		this.dir = 'right';
		this.posArr = [
			[1, 0],
			[0, 0]
		];
		ctx.clearRect(0, 0, canvasW, canvasH);
		this.init();
	},
	move: function() {
		var x = this.posArr[0][0],
				y = this.posArr[0][1];
		if(this.vy != 0) {
			y += this.vy;
		} else if (this.vx != 0) {
			x += this.vx;
		}
		if(this.posArr.length === Painter.col * Painter.row) {
			alert('You win!');
			return ;
		}
		if(x > canvasW - 20 || x < 0 || y > canvasH - 20 || y < 0
				|| this.tagArr[y][x]) {
			alert('Game over');
			return ;
		}
		if(Food.tagArr[y][x]) {
			this.isEat = true;
			Food.tagArr[y][x] = 0;
		}
		this.posArr.unshift([x, y]);
		this.view();
		this.step++;
		if(this.step === 10) {
			Food.view();
			this.step = 0;
		}
		this.counter++;
		if(this.counter * this.timeGap > 60000) {
			if(this.timeGap > 200) {
				this.timeGap -= 100;
			}
			this.counter = 0;
		}
		var self = this;
		timer = setTimeout(function() {
			self.move();
		}, this.timeGap);
	}
}

var Food = {
	tagArr: null,
	init: function() {
		this.tagArr = new Array();
		for(var i = 0; i < Painter.row; i++) {
				this.tagArr[i] = new Array();
			for(var j = 0; j < Painter.col; j++) {
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
			ctx.fillRect(j * 20, i * 20, 20, 20);
		}
	}
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
			startBtn.style.display = 'none';
			continueBtn.style.display = 'inline-block';
			var type = game_type.value;
			console.log(type);
			Snake.move();
		}, false);
		continueBtn.addEventListener('click', function() {
			Snake.move();
		}, false);
		stopBtn.addEventListener('click', function() {
			clearTimeout(timer);
		}, false);
		endBtn.addEventListener('click', function() {
			clearTimeout(timer);
			alert('Game over!');
		}, false);
		replayBtn.addEventListener('click', function() {
			startBtn.style.display = 'inline-block';
			continueBtn.style.display = 'none';
			clearTimeout(timer);
			Snake.reset();
			Food.init();
			Food.view();
		})
		window.addEventListener('keydown', function(e) {
			var key = e.keyCode || e.which;
			switch(key) {
				case 37: //左
				case 65:
					if (Snake.vx == 0) {
						Snake.vx = -1;
					}
					Snake.vy = 0;
					break;
				case 38: //上
				case 87:
					if (Snake.vy == 0) {
						Snake.vy = -1;
					}
					Snake.vx = 0;
					break;
				case 39: //右
				case 68:
					if (Snake.vx == 0) {
						Snake.vx = 1;
					}
					Snake.vy = 0;
					break;
				case 40: //下
				case 83:
					if (Snake.vy == 0) {
						Snake.vy = 1;
					}
					Snake.vx = 0;
					break;
				case 32:
					clearTimeout(timer);
				default:
					;
			}
		})
	}
}

page.init();