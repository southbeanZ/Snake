var board = document.getElementById('board'),
		startBtn = document.getElementById('btn_start'),
		stopBtn = document.getElementById('btn_stop'),
		endBtn = document.getElementById('btn_end'),
		ctx = board.getContext('2d');
		ctx.strokeStyle = "#BFBFBF";

/*
 * 绘制场地
 */
var Painter = {
	init: function(w, h) {
		var col = w / 20,
				row = h / 20;
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
	x: 0,
	y: 0,
	length: 2,
	vx: 1,
	vy: 0,
	view: function() {
		ctx.fillStyle = '#000';
		ctx.fillRect(this.x, this.y, this.length * 20, 20);
	}
}

function move() {
	ctx.clearRect(Snake.x, Snake.y, Snake.length * 20, 20);
	Snake.x += 20;
	Snake.view();
	setTimeout(function() {
		window.requestAnimationFrame(move);
	}, 1000);
}


var page = {
	init: function() {
		this.view();
		this.listen();
	},
	view: function() {
		Painter.init(600, 400);
		Snake.view();
	},
	listen: function() {
		startBtn.addEventListener('click', function() {
			move();
		}, false);
	}
}

page.init();