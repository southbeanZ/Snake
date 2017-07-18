var board = document.getElementById('board'),
		background = document.getElementById('back'),
		startBtn = document.getElementById('btn_start'),
		continueBtn = document.getElementById('btn_continue'),
		stopBtn = document.getElementById('btn_stop'),
		endBtn = document.getElementById('btn_end'),
		resetBtn = document.getElementById('btn_reset'),
		gameType = document.getElementById('game_type'),
		gameScore = document.getElementById('game_score'),
		gameInfo = document.getElementById('game_info'),
		gameLevel = document.getElementById('game_level'),
		finalScore = document.getElementById('final_score'),
		pop = document.getElementById('pop'),
		popType = document.getElementById('pop-type'),
		popStop = document.getElementById('pop-stop'),
		popResult = document.getElementById('pop-result'),
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
	init: function() {
		this.vx = 1;
		this.vy = 0;
		this.timeGap = 800;
		this.posArr = [ //记录每一节位置
			[1, 0],
			[0, 0]
		];
		this.tagArr = null; //记录游戏区每一格占据信息
		this.isEat = false;
		this.step = 0; //食物生成步数
		this.counter = 0; //普通模式计时
		this.mode = 0;  // 0：普通模式 1：关卡模式 2：躲避模式
		this.score = this.score || 0;
		this.goalScore = 10; //过关模式
		this.level = 1;
		this.goalScore2 = 5; //躲避模式

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
		if(this.mode === 0) {
			if(this.isWin0()) {
				return ;
			}
			this.counter++;
			if(this.counter * this.timeGap > 60000) {
				if(this.timeGap > 200) {
					this.timeGap -= 100;
				}
				this.counter = 0;
			}
		} else if (this.mode === 1) {
			if(this.isWin1()) {
				return ;
			}
		} else if (this.mode === 2) {
			if(this.isWin2()) {
				return ;
			}
			this.counter++;
			if(this.counter * this.timeGap > 60000) {
				if(this.timeGap > 200) {
					this.timeGap -= 100;
				}
				this.counter = 0;
			}
		}
		if(x > Painter.col - 1 || x < 0 || y > Painter.row - 1 || y < 0   //撞到四壁
				|| this.tagArr[y][x]                                          //撞到自己
				|| Snake.mode ===2 && Wall.tagArr[y][x]) {                    //撞到障碍物
			pop.style.display = 'block';
			finalScore.innerHTML = gameScore.innerHTML;
			popResult.style.display = 'block';
			return ;
		}
		if(Food.tagArr[y][x]) {
			this.isEat = true;
			Food.tagArr[y][x] = 0;
			this.score ++;
			gameScore.innerHTML = this.score;
		}
		this.posArr.unshift([x, y]);
		this.view();
		this.step++;
		if(this.step === 10) {
			Food.view();
			this.step = 0;
		}
		var self = this;
		timer = setTimeout(function() {
			self.move();
		}, this.timeGap);
		page.keyPress = false;
	},
	isWin0: function() {
		if(this.posArr.length === Painter.col * Painter.row) {
			alert('You win!');
			return true;
		}
		return false;
	},
	isWin1: function() {
		if(this.posArr.length === (this.goalScore + 2)) {
			if(this.level == 7) {
				alert('You win!');
				return true;
			} else {
				alert('Pass level' + this.level + '!');
			}
			this.goalScore += 10;
			this.level += 1;
			gameLevel.innerHTML = this.level;
			this.timeGap -= 100;
		}
		return false;
	},
	isWin2: function() {
		if(this.posArr.length === (this.goalScore2 + 2)) {
			if(this.level == 3) {
				alert('You win!');
				return true;
			} else {
				alert('Pass level' + this.level + '!');
				clearTimeout(timer);
				this.reset();
				this.mode = 2;
				Wall.init();
				Wall.level += 1;
				this.level = Wall.level;
				gameLevel.innerHTML = this.level;
				Wall.view();
				Food.init();
				this.move();
				return true;
			}
		}
		return false;
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
		this.view();
	},
	view: function() {
		var i = Math.floor(Math.random() * Painter.row),
				j = Math.floor(Math.random() * Painter.col);
		var pos = [i, j];
		if(Snake.tagArr[i][j] || this.tagArr[i][j] || (Snake.mode ===2 && Wall.tagArr[i][j])) {
			this.view();
			return ;
		} else {
			this.tagArr[i][j] = 1;
			ctx.fillStyle = '#ddb146';
			ctx.fillRect(j * 20, i * 20, 20, 20);
		}
	}
}

var Wall = {
	tagArr: null,
	posX: [
		[2, 2, 7, 7],
		[3, 4, 5, 6, 3, 4, 5, 6],
		[2, 2, 3, 2, 2, 3, 6, 7, 7, 6, 7, 7, 4, 5]
	],
	posY: [
		[2, 12, 2, 12],
		[3, 3, 3, 3, 11, 11, 11, 11],
		[2, 3, 2, 11, 12, 12, 2, 2, 3, 12, 12, 11, 7, 7]
	],
	level: 1,
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
		ctx.fillStyle = '#aaa';
		if(this.level > 1) {
			this.posX[this.level - 2].forEach((_e, _i) => {
				var _y = this.posY[this.level - 2][_i];
				ctx.clearRect(_y * 20, _e * 20, 20, 20);
			});
		}
		this.posX[this.level - 1].forEach((_e, _i) => {
			var _y = this.posY[this.level - 1][_i];
			this.tagArr[_e][_y] = 1;
			ctx.fillRect(_y * 20, _e * 20, 20, 20);
		});
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
		Wall.init();
	},
	listen: function() {
		startBtn.addEventListener('click', function() {
			pop.style.display = 'none';
			popType.style.display = 'none';

			//获取游戏模式
			var mode = document.getElementsByName('game_type');
			mode.forEach((_e) => {
				if(_e.checked) {
					Snake.mode = +_e.value;
				}
			});
			if(Snake.mode > 0) {
				gameInfo.style.display = 'block';
				if(Snake.mode === 2) {
					Wall.view();
				}
			}
			Food.init();
			Snake.move();
		}, false);
		continueBtn.addEventListener('click', function() {
			pop.style.display = 'none';
			popStop.style.display = 'none';
			Snake.move();
		}, false);
		stopBtn.addEventListener('click', function() {
			pop.style.display = 'block';
			popStop.style.display = 'block';
			clearTimeout(timer);
		}, false);
		endBtn.addEventListener('click', function() {
			clearTimeout(timer);
			popStop.style.display = 'none';
			finalScore.innerHTML = gameScore.innerHTML;
			popResult.style.display = 'block';
		}, false);
		resetBtn.addEventListener('click', function() {
			popResult.style.display = 'none';
			popType.style.display = 'block';
			gameInfo.style.display = 'none';
			gameScore.innerHTML = 0;
			clearTimeout(timer);
			Snake.reset();
			Wall.init();
			Wall.level = 1;
		}, false);
		this.keyPress = false;
		window.addEventListener('keydown', function(e) {
			if(!page.keyPress) {
				page.keyPress = true;
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
			}
		})
	}
}

page.init();