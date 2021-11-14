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
		this.birdElm.style.setProperty('--bird-top', this.top);
		this._timeSinceLastJump += delta;
	}

	handleJump = (e) => {
		if (e.code === 'Space' || e.type === 'click') this._timeSinceLastJump = 0;
	};

	setUp(isMobile) {
		this._top = window.innerHeight / 2;

		// Remove them here so there is only 1 eventlistener if user changes width midgame.
		document.removeEventListener('click', this.handleJump);
		document.removeEventListener('keydown', this.handleJump);
		if (isMobile) {
			document.addEventListener('click', this.handleJump);
		} else {
			document.addEventListener('keydown', this.handleJump);
			document.addEventListener('click', this.handleJump);
		}
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
