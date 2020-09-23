module.exports = {
	on: on,
	preventDefault: preventDefault,
	getNodes: getNodes,
	getItemURL: getItemURL,
	getPreviousDate: getPreviousDate,
	getMonths: getMonths,
	getHeaderData: getHeaderData,
	filterOut: filterOut,
	updateSPToken: updateSPToken,
	startLoader: startLoader,
	reload: reload,
	editorOptions: editorOptions,
	limitIndicatorValues: limitIndicatorValues,
	createScorecardTitle: createScorecardTitle,
	fromArrowToSP: fromArrowToSP,
	fromLikelihoodToSP: fromLikelihoodToSP,
	fromDateToSP: fromDateToSP,
	generateView: generateView,
	generateHash: generateHash
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

function getItemURL(date) {
	const itemDate = date ? date : document.getElementById('scorecards-content').dataset.date;

	return `${app.storage.site}/_api/web/lists/getbytitle('${app.storage.scorecardsList}')/items?$filter=(scoredate eq '${itemDate}')`;
}

function getPreviousDate(date) {
    const previousMonth = (parseInt(date.split('-')[1]) == 1) ? 12 : parseInt(date.split('-')[1]) -1;
    const previousYear = (previousMonth == 12) ? parseInt(date.split('-')[0]) -1 : parseInt(date.split('-')[0]);
    const formattedMonth = (previousMonth > 9) ? previousMonth : `0${previousMonth}`;

    return `${previousYear}-${formattedMonth}-15T00:00:00Z`;
}

function getMonths() {
	return [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
}

function getHeaderData() {
	const date = app.scorecards[0].scoredate.split('-');
    const year = date[0];
    const month = parseInt(date[1]) + 1;
    const updatedMonth = month > 9 ?  month : `0${month}`;

    return {
        scorecards: app.scorecards,
		minDate: `${year}-${updatedMonth}`,
		isAdmin: app.admin
    };
}

function filterOut(value) {
	return isNaN(parseInt(value)) ? "" : value;
}

function updateSPToken() {
	setInterval( () => {
        UpdateFormDigest(_spPageContextInfo.webServerRelativeUrl, _spFormDigestRefreshInterval);
    }, 15 * 60000);
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

function reload() {
	location.href = "";
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
	const months = getMonths();
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

function generateView(hash) {
	const context = hash.split('-')[0];
	const month = hash.split('-')[1];
	const year = hash.split('-')[2];

	const months = getMonths().map( (i) => i.toLowerCase().slice(0,3) );
	const monthIndex = months.indexOf(month) + 1;
	const spMonth = (monthIndex > 9) ? monthIndex : `0${monthIndex}`;

	const view = context == "#wca" ? "wca-content" : (context == "#hubs" ? "hubs-content" : "actions-content");
	const date = `${year}-${spMonth}-15T00:00:00Z`;

	return [view, date];
}

function generateHash(date) {
	const context = document.querySelector('.active-content').id;
	const view = context == "wca-content" ? "wca" : (context == "hubs-content" ? "hubs" : document.querySelector('.active-action').id);

	const dateSplitted = date.split('-');
	const months = getMonths().map( (i) => i.toLowerCase().slice(0,3) );
	const month = months[parseInt(dateSplitted[1]) - 1];
	const year = dateSplitted[0];

	return `${view}-${month}-${year}`;
}