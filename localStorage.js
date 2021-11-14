function getData(key) {
	const data = localStorage.getItem(key);
	const objects = JSON.parse(data);
	return objects;
}

function populateStorage(data, key) {
	localStorage.setItem(key, JSON.stringify(data));
}

function checkStorage(key, defaultValue) {
	if (!localStorage.getItem(key)) {
		return defaultValue;
	} else {
		return getData(key);
	}
}

export { populateStorage, checkStorage };
