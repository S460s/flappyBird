import Bird from './bird.js';
import PipeController from './pipe.js';

const birdElm = document.querySelector('[data-bird]');
const title = document.querySelector('[data-title]');
const subTitle = document.querySelector('[data-subtitle]');

const bird = new Bird(birdElm);
const pipeController = new PipeController();

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

function handleStart() {
	lastTime = null;
	title.classList.add('hide');
	window.requestAnimationFrame(updateLoop);
	bird.setUp();
	pipeController.setUp();
}

function handleLoose() {
	setTimeout(() => {
		title.classList.remove('hide');
		subTitle.classList.remove('hide');
		subTitle.textContent = `${pipeController.passedPipes} pipes!`;
		document.addEventListener('keypress', handleStart, { once: true });
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

document.addEventListener('keypress', handleStart, { once: true });
