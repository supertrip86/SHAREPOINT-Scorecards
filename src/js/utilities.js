module.exports = {
	on: on,
	preventDefault: preventDefault,
	getNodes: getNodes,
	getItemURL: getItemURL,
	getPreviousDate: getPreviousDate,
	getMonths: getMonths,
	getActionFields: getActionFields,
	getAllUsers: getAllUsers,
	getHeaderData: getHeaderData,
	getActionsData: getActionsData,
	getSaveMode: getSaveMode,
	filterOut: filterOut,
	areHubsEmpty: areHubsEmpty,
	isColumnEmpty: isColumnEmpty,
	updateSPToken: updateSPToken,
	startLoader: startLoader,
	removeLoader: removeLoader,
	reload: reload,
	editorOptions: editorOptions,
	userSelectOptions: userSelectOptions,
	excelStyleOptions: excelStyleOptions,
	limitIndicatorValues: limitIndicatorValues,
	createScorecardTitle: createScorecardTitle,
	fromArrowToSP: fromArrowToSP,
	fromLikelihoodToSP: fromLikelihoodToSP,
	fromDateToSP: fromDateToSP,
	formatLikelihood: formatLikelihood,
	formatActions: formatActions,
	generateView: generateView,
	generateHash: generateHash,
	validateHash: validateHash,
	highlightValues: highlightValues,
	highlightLikelihood: highlightLikelihood
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
	const previousDate = getPreviousDate(itemDate);
	const isMinDate = (itemDate == app.scorecards[app.scorecards.length -1].scoredate);

	if (isMinDate) {
		return `${app.storage.site}/_api/web/lists/getbytitle('${app.storage.scorecardsList}')/items?$filter=(scoredate eq '${itemDate}')`;
	}

	return `${app.storage.site}/_api/web/lists/getbytitle('${app.storage.scorecardsList}')/items?$filter=((scoredate eq '${itemDate}') or (scoredate eq '${previousDate}'))&$orderby=scoredate desc`;
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

function getActionFields() {
	return ["Project", "Country", "Stage", "Action", "Status", "Updates", "Lead", "Deadline"];
}

function getAllUsers(data) {
	let users = [];

	data.forEach( (i) => {
		if (i.Title.indexOf(", ") > -1 && i.Email.indexOf("@ifad.org") > -1) {
			users.push({
				label: i.Title,
				value: i.Title,
				email: i.Email
			});
		}
	});

	return users;
}

function getHeaderData() {
	const split = app.scorecards.length ? app.scorecards[0].scoredate.split('-') : [];

	const year = split.length ? split[0] : new Date().getFullYear();
	const month = split.length ? (parseInt(split[1]) + 1) : (new Date().getMonth() + 1);
	const updatedMonth = month > 9 ?  month : `0${month}`;

	const date = `${year}-${updatedMonth}`;

    return {
        scorecards: app.scorecards,
		minDate: date,
		isAdmin: app.admin
    };
}

function getActionsData(id, currentItem, previousItem) {
	const actionsTarget = id.split('-')[0];
	const actionsCurrent = formatActions(currentItem, actionsTarget);
	const actionsPrevious = formatActions(previousItem, actionsTarget);
	const settings = app.settings;

	return {current: actionsCurrent, previous: actionsPrevious, settings: settings};
}

function getSaveMode(context, retrieved) {
	switch (context) {
		case "wca":
			return false;

		case "hubs":
			return areHubsEmpty(retrieved, 'data');

		case "west":
			return isColumnEmpty(retrieved, 'west', 'action');

		case "coastal":
			return isColumnEmpty(retrieved, 'coastal', 'action');

		case "central":
			return isColumnEmpty(retrieved, 'central', 'action');
	}
}

function filterOut(value) {
	return isNaN(parseInt(value)) ? "" : value;
}

function areHubsEmpty(scorecards, context) {
	const isWestEmpty = !scorecards[`west${context}`];
	const isCoastalEmpty = !scorecards[`coastal${context}`];
	const isCentralEmpty = !scorecards[`central${context}`];

	return isWestEmpty && isCoastalEmpty && isCentralEmpty;
}

function isColumnEmpty(scorecards, column, context) {
	return !scorecards[`${column}${context}`];
}

function updateSPToken() {
	setInterval( () => {
        UpdateFormDigest(_spPageContextInfo.webServerRelativeUrl, _spFormDigestRefreshInterval);
    }, 15 * 60000);
}

function startLoader() {
	const body = document.getElementsByTagName('body')[0];
	const main = document.getElementById('scorecards-content')
	const header = document.getElementById('scorecards-header')
	const spinner = '<div class="spinner"></div>';

	main.style.display = "none";
	header.style.display = "none";
	body.style.backgroundColor = "#003870";
	body.insertAdjacentHTML('beforeend', spinner);
}

function removeLoader() {
	const body = document.getElementsByTagName('body')[0];
	const main = document.getElementById('scorecards-content')
	const header = document.getElementById('scorecards-header')
	const spinner = document.querySelector('.spinner');

	main.removeAttribute('style');
	header.removeAttribute('style');
	body.removeAttribute('style');
	spinner.remove();
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

function userSelectOptions(list, value) {
	return {
		options: list,
		value: value,
		placeholder: "Select a Lead",
		autocomplete: true,
		multiple: false,
		icon: "remove-user",
		onChange: () => getNodes('.select-pure__select').forEach( (i) => {
			if (i.querySelector('.select-pure__label').innerText != "") {
				i.removeAttribute('style');
			}
		})
	};
}

function excelStyleOptions() {
	return {
		rowWidth: [{"hpx": 26},{"hpx": 12}],
		rowHeight: [{"wch": 20},{"wch": 13},{"wch": 8},{"wch": 50},{"wch": 8},{"wch": 50},{"wch": 15},{"wch": 20}],
		firstRow: {
			alignment: { wrapText: true, horizontal: "left", vertical: "top" },
			font: {
				name: "Helvetica",
				sz: 8,
				bold: true,
				color: {
					rgb: "000000"
				}
			}
		},
		header: {
			alignment: {horizontal: "center", vertical: "center"},
			font: {
				name: "Helvetica",
				sz: 8,
				bold: true,
				color: {rgb: "ffffff"}
			},
			fill: {
				fgColor: {rgb: "808080"}
			}, 
			border: {
				top: {style: 'dotted'}, 
				left: {style: 'dotted'}, 
				right: {style: 'dotted'}, 
				bottom: {style: 'dotted'}
			}
		},
		subHeader: {
			font: {name: "Helvetica", sz: 8, bold: true},
			fill: {
				fgColor: {rgb: "99FFDF"}
			},
			border: {
				top: {style: 'dotted'},
				left: {style: 'dotted'},
				right: {style: 'dotted'},
				bottom: {style: 'dotted'}
			}
		},
		row: {
			alignment: {wrapText: true, vertical: "top"},
			font: {name: "Helvetica", sz: 8},
			border: {
				top: {style: 'dotted'},
				left: {style: 'dotted'},
				right: {style: 'dotted'},
				bottom: {style: 'dotted'}
			}
		}
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

function formatLikelihood(value) {
	switch (value) {
        case 0:
            return '';
        case 1:
            return 'green-line';
        case 2:
            return 'yellow-line';
        case 3:
            return 'orange-line';
        case 4:
            return 'red-line';
    }
}

function formatActions(item, action) {
	const element = item ? item[`${action}action`] : null;
	const settings = app.settings;

	if (element) {
		let data = [];

		Object.keys(element).forEach( (i) => {
			let title = settings.filter( (d) => (d.Code == i) )[0].Title;
			let indexes = Object.values( element[i] ).length ? Object.values( element[i] ).map( (d) => parseInt(d.Index)) : [];
			let max = indexes.length ? Math.max(...indexes) : 0;
			let actions = {};

			Object.keys( element[i] ).forEach( (d) => {
				actions[d] = element[i][d];
			});

			data.push({
				code: i,
				title: title,
				max: max,
				data: actions
			});
		});

		return data;
	}

	return null;
}

function generateView(hash) {
	const context = hash.split('-')[0];
	const month = hash.split('-')[1];
	const year = hash.split('-')[2];

	const months = getMonths().map( (i) => i.toLowerCase().slice(0,3) );
	const monthIndex = months.indexOf(month) + 1;
	const spMonth = (monthIndex > 9) ? monthIndex : `0${monthIndex}`;

	const view = context == "wca" ? "wca-content" : (context == "hubs" ? "hubs-content" : "actions-content");
	const date = `${year}-${spMonth}-15T00:00:00Z`;

	return [view, date];
}

function generateHash(date) {
	const context = document.querySelector('.active-content').id;
	const view = (context == "wca-content") ? "wca" : ( (context == "hubs-content") ? "hubs" : document.querySelector('.active-action').id.split('-')[0] );

	const dateSplitted = date.split('-');
	const months = getMonths().map( (i) => i.toLowerCase().slice(0,3) );
	const month = months[parseInt(dateSplitted[1]) - 1];
	const year = dateSplitted[0];

	return `${view}-${month}-${year}`;
}

function validateHash() {
	const hash = location.hash;

	if (hash) {
		const split = hash.split('-');

		if (split.length == 3) {
			const view = split[0];
			const month = getMonths().map( (i) => i.toLowerCase().slice(0,3) ).indexOf(split[1]);
			const year = split[2];
			const date = [year, month];

			if ( validateView(view) && validateDate(date) ) {
				return true;
			}
		}
	}

	function validateView(view) {
		switch (view) {
			case "#wca":
				return true;
			case "#hubs":
				return true;
			case "#west":
				return true;
			case "#coastal":
				return true;
			case "#central":
				return true;
			default:
				return false;
		}
	}

	function validateDate(date) {
		const nodes = getNodes('.dropdown-item-element');
		const maxDate = nodes[0].dataset.date.split('-');
		const minDate = nodes[nodes.length -1].dataset.date.split('-');

		return new Date(maxDate[0], maxDate[1], 1) <= new Date(date[0], date[1], 1) <= new Date(minDate[0], minDate[1], 1);
	}
}

function highlightValues(values, code, side) {
	if (values.length > 0) {
		const maxValue = Math.max.apply(null, values);
		const row = document.querySelector(`.active-content .scorecard-row[data-code="${code}"]`);
		const target = row.querySelector(`.scorecard-indicator-value-${side}`);
		const wcaValue = target.value;

		if (wcaValue) {
			(parseFloat(wcaValue) > maxValue) && (target.style.backgroundColor = "#FFFF00");
		}
	}
}

function highlightLikelihood(likelihood, counter, code, side) {
	if (counter != 0) {
		const averageLikelihood = formatLikelihood(Math.round( likelihood / counter));
		const row = document.querySelector(`.active-content .scorecard-row[data-code="${code}"]`);
		const target = row.querySelector(`.scorecard-likelihood-${side} .line`);
		const wcaLikelihood = formatLikelihood( fromLikelihoodToSP(target) );

		if (wcaLikelihood != averageLikelihood) {
			target.parentElement.style.borderColor = "#FF0000";
			target.parentElement.style.borderWidth = "2px";
		}
	}
}