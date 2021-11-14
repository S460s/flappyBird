class Pipe {
	constructor(pipeElm, id) {
		this.pipeElm = pipeElm;
		this.id = id;
	}

	coords() {
		return [
			this.pipeElm.firstChild.getBoundingClientRect(),
			this.pipeElm.lastChild.getBoundingClientRect(),
		];
	}

	get left() {
		return parseFloat(
			getComputedStyle(this.pipeElm).getPropertyValue('--pipe-left')
		);
	}
	set left(value) {
		this.pipeElm.style.setProperty('--pipe-left', value);
	}
}

export default class PipeController {
	pipes = [];
	_timeSinceLastPipe = 0;
	currentId = 0;
	passedPipes = 0;

	constructor(
		scoreElm,
		HOLE_HEIGHT = 225,
		PIPE_INTERVAL = 2000,
		PIPE_SPEED = 0.35,
		PIPE_WIDTH = 120
	) {
		this.scoreElm = scoreElm;
		this.HOLE_HEIGHT = HOLE_HEIGHT;
		this.PIPE_INTERVAL = PIPE_INTERVAL;
		this.PIPE_SPEED = PIPE_SPEED;
		this.PIPE_WIDTH = PIPE_WIDTH;
	}

	getPipeCoords() {
		return this.pipes.flatMap((pipe) => pipe.coords());
	}

	setUp() {
		document.documentElement.style.setProperty('--pipe-width', this.PIPE_WIDTH);
		document.documentElement.style.setProperty(
			'--hole-height',
			this.HOLE_HEIGHT
		);
		this._timeSinceLastPipe = this.PIPE_INTERVAL;
		this.passedPipes = 0;
		this.pipes.forEach((pipe) => pipe.pipeElm.remove());
	}

	updatePipes(delta) {
		this._timeSinceLastPipe += delta;

		if (this._timeSinceLastPipe > this.PIPE_INTERVAL) {
			this._timeSinceLastPipe -= this.PIPE_INTERVAL;
			this._createPipe();
		}

		this.pipes.forEach((pipe) => {
			console.log(pipe.left);
			if (pipe.left + this.PIPE_WIDTH < 0) {
				this.passedPipes++;
				this._displayScore();
				return this._removePipe(pipe);
			}
			pipe.left = pipe.left - delta * this.PIPE_SPEED;
		});
	}

	_displayScore() {
		this.scoreElm.classList.remove('hide');
		this.scoreElm.textContent = this.passedPipes;
	}

	_removePipe(pipe) {
		this.pipes = this.pipes.filter((p) => p.id !== pipe.id);
		return pipe.pipeElm.remove();
	}

	_randomNumBetween(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	_createPipeSegment(position) {
		const segment = document.createElement('div');
		segment.classList.add('segment', position);
		return segment;
	}

	_createPipeElm() {
		const pipeElm = document.createElement('div');
		const topElm = this._createPipeSegment('top');
		const bottomElm = this._createPipeSegment('bottom');
		pipeElm.append(topElm);
		pipeElm.append(bottomElm);
		pipeElm.classList.add('pipe');
		pipeElm.style.setProperty(
			'--hole-top',
			this._randomNumBetween(
				this.HOLE_HEIGHT * 1.5,
				window.innerHeight - this.HOLE_HEIGHT * 0.5
			)
		);
		return pipeElm;
	}

	_createPipe() {
		const pipeElm = this._createPipeElm();
		const pipe = new Pipe(pipeElm, this.currentId);
		this.currentId++;
		pipe.left = window.innerWidth;
		document.body.append(pipeElm);
		this.pipes.push(pipe);
	}
}
