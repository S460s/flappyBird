import { populateStorage, checkStorage } from './localStorage.js';

const settingsElm = document.querySelector('[data-settings]');
const colorInputs = document.querySelectorAll('.colorInput');
const saveBtn = document.querySelector('[data-save]');

const defaultColors = {
	birdColor: 'yellow',
	pipeColor: 'green',
	backgroundColor: 'white',
};

const toggleMenu = (e) => {
	if (e.ctrlKey && e.key === 'm') {
		settingsElm.classList.toggle('settings');
	}
};

const renderColors = () => {
	colorInputs.forEach((input) => {
		const color = checkStorage(input.id, defaultColors[input.id]);
		document.documentElement.style.setProperty(`--${input.id}`, color);
		input.value = color;
	});
};

const saveColors = (e) => {
	colorInputs.forEach((input) => {
		populateStorage(input.value, input.getAttribute('id'));
	});
	renderColors();
	settingsElm.classList.toggle('settings');
};

function setUpSettings() {
	document.addEventListener('keydown', toggleMenu);
	saveBtn.addEventListener('click', saveColors);
	renderColors();
}

export { setUpSettings };
