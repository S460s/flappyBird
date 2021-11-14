import Bird from './bird.js';
import PipeController from './pipe.js';

const birdElm = document.querySelector('[data-bird]');
const title = document.querySelector('[data-title]');
const subTitle = document.querySelector('[data-subtitle]');
const scoreElm = document.querySelector('[data-score]');

const isMobile = () => window.innerWidth <= 640;

let bird;
let pipeController;

// Fix ssettings for mobile.
if (isMobile()) {
	pipeController = new PipeController(scoreElm, 180, 2500, 0.2, 60);
	bird = new Bird(birdElm, 0.3);
} else {
	pipeController = new PipeController(scoreElm);
	bird = new Bird(birdElm);
}

const addListeners = () => {
	if (isMobile()) {
		title.addEventListener('click', handleStart, { once: true });
		title.firstChild.textContent = 'Click to start';
	} else {
		document.addEventListener('keypress', handleStart);
		title.addEventListener('click', handleStart, { once: true });
		title.firstChild.textContent = 'Play!';
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
	} else if (e.code === 'Space') {
		// remove both event listeners as the keypress isn't {once: true} because it waits for space.
		document.removeEventListener('click', handleStart);
		document.removeEventListener('keypress', handleStart);
	} else return;

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
		subTitle.textContent = `Score: ${pipeController.passedPipes}.`;
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
