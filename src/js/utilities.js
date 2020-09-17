module.exports = {
	on: on,
	preventDefault: preventDefault,
	getNodes: getNodes,
	startLoader: startLoader,
	editorOptions: editorOptions,
	limitIndicatorValues: limitIndicatorValues,
	createScorecardTitle: createScorecardTitle,
	// fromSPtoArrow: fromSPtoArrow,
	fromArrowToSP: fromArrowToSP,
	fromLikelihoodToSP: fromLikelihoodToSP,
	fromDateToSP: fromDateToSP,
};

function on(selector, eventType, childSelector, eventHandler) {
	const elements = document.querySelectorAll(selector);

    for (element of elements) {
      	element.addEventListener(eventType, eventOnElement => {
			if (eventOnElement.target.matches(childSelector)) {
				eventHandler(eventOnElement);
			}
      	});
    }
}

function getNodes(value, context) {
	const target = context ? context : document;

	return Array.from(target.querySelectorAll(value));
}

function startLoader() {
	const body = document.getElementsByTagName('body')[0];
	const dialog = document.getElementById('settingsMenu');
	const settingsIcon = document.querySelector('.settings-link');
	const spinner = '<div class="spinner"></div>';

	dialog.setAttribute('style', 'display: none;');
	settingsIcon.setAttribute('style', 'display: none;');
	body.setAttribute('style', 'user-select: none; overflow: hidden;')
	body.insertAdjacentHTML('beforeend', spinner);
}

function preventDefault(e) {
	e.preventDefault();
}

function editorOptions() {
	return {
		modules: {
			'toolbar': [ 
				[ 'bold', 'italic', 'underline' ], 
				[{ 'color': [] }, { 'background': [] }, { 'script': 'sub'}, { 'script': 'super' }], 
				[{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }], 
				[{ 'align': [] }], [ 'link'] 
			]
		},
		placeholder: 'Insert a description',
		theme: 'snow'
	};
}

function limitIndicatorValues(e) {
    if (((e.charCode < 46 || e.charCode > 57) || e.charCode === 47) || (e.charCode === 46 && e.target.value.indexOf('.') !== -1)) {
        e.preventDefault();
    }
}

function createScorecardTitle() {
	const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
	const startDate = document.getElementById('date-button').value.split('-').map( (i) => parseInt(i) );
	const month = startDate[1] -1;
	const year = startDate[0];

	return `${months[month]} ${year}`;
}

function fromArrowToSP(element) {
	if (element.classList.contains('scorecard-indicator-arrow-down')) {
		return 1;

	} else if (element.classList.contains('scorecard-indicator-arrow-right')) {
		return 2;

	} else if (element.classList.contains('scorecard-indicator-arrow-up')) {
		return 3;

	} else {
		return 0;
	}
}

function fromLikelihoodToSP(element) {
	if (element.classList.contains('green-line')) {
		return 1;

	} else if (element.classList.contains('yellow-line')) {
		return 2;

	} else if (element.classList.contains('orange-line')) {
		return 3;

	} else if (element.classList.contains('red-line')) {
		return 4;

	} else {
		return 0;
	}
}

function fromDateToSP() {
	const date = document.getElementById('date-button').value.split('-');

	return `${date[0]}-${date[1]}-15T00:00:00Z`;
}