import Bird from './bird.js';
import PipeController from './pipe.js';

const birdElm = document.querySelector('[data-bird]');
const title = document.querySelector('[data-title]');
const subTitle = document.querySelector('[data-subtitle]');
const scoreElm = document.querySelector('[data-score]');

const isMobile = () => window.innerWidth <= 640;

const bird = new Bird(birdElm);
const pipeController = new PipeController(scoreElm);

const addListeners = () => {
	if (isMobile()) {
		document.addEventListener('click', handleStart, { once: true });
		title.firstChild.textContent = 'Click to start';
	} else {
		document.addEventListener('keypress', handleStart, { once: true });
		document.addEventListener('click', handleStart, { once: true });

		title.firstChild.textContent = 'Press any key to start or click';
	}
};

let lastTime = null;
function updateLoop(time) {
	if (lastTime === null) {
		lastTime = time;
		window.requestAnimationFrame(updateLoop);
		return;
	}
	const delta = time - lastTime;
	bird.updateBird(delta);
	pipeController.updatePipes(delta);
	const insidePipe = pipeController
		.getPipeCoords()
		.some((coord) => isCollision(bird.birdElm.getBoundingClientRect(), coord));
	if (bird.isLoosing() || insidePipe) return handleLoose();
	lastTime = time;
	window.requestAnimationFrame(updateLoop);
}

function handleStart(e) {
	if (e.type === 'click') {
		document.removeEventListener('keypress', handleStart);
	} else {
		document.removeEventListener('click', handleStart);
	}

	lastTime = null;
	title.classList.add('hide');
	window.requestAnimationFrame(updateLoop);
	bird.setUp(isMobile());
	pipeController.setUp();
}

function handleLoose() {
	setTimeout(() => {
		title.classList.remove('hide');
		subTitle.classList.remove('hide');
		scoreElm.classList.add('hide');
		subTitle.textContent = `${pipeController.passedPipes} pipes!`;
		addListeners();
	}, 100);
}

function isCollision(coords1, coords2) {
	return (
		coords1.left < coords2.right &&
		coords1.top < coords2.bottom &&
		coords1.right > coords2.left &&
		coords1.bottom > coords2.top
	);
}

addListeners();
