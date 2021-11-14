class Bird {
	_top = null;
	_timeSinceLastJump = Number.POSITIVE_INFINITY;

	constructor(birdElm, SPEED = 0.5, JUMP_DURATION = 125) {
		this.SPEED = SPEED;
		this.birdElm = birdElm;
		this.JUMP_DURATION = JUMP_DURATION;
	}

	updateBird(delta) {
		this.top = this._timeSinceLastJump < this.JUMP_DURATION ? -delta : delta;
		console.log(this.top);
		this.birdElm.style.setProperty('--bird-top', this.top);
		this._timeSinceLastJump += delta;
	}

	handleJump = (e) => {
		if (e.code !== 'Space') return;
		this._timeSinceLastJump = 0;
	};

	setUp() {
		this._top = window.innerHeight / 2;
		document.removeEventListener('keydown', this.handleJump);
		document.addEventListener('keydown', this.handleJump);
	}

	isLoosing() {
		const coords = this.birdElm.getBoundingClientRect();
		return coords.top < 0 || coords.bottom > window.innerHeight;
	}

	get top() {
		return this._top;
	}

	set top(delta) {
		this._top = this._top + this.SPEED * delta;
	}
}

export default Bird;
