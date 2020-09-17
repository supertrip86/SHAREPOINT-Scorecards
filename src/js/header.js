import "quill/dist/quill.snow.css";
import "../css/header.css";
import "../css/wca.css";
import Header from "../hbs/header.hbs";
import Wca from "../hbs/wca.hbs";
import wcaCreate from "../hbs/wcaCreate.hbs";
import wcaEdit from "../hbs/wcaEdit.hbs";
import CancelButton from "../hbs/partials/cancelButton.hbs";
import EditButton from "../hbs/partials/editButton.hbs";
import Quill from 'quill';
import utilities from "./utilities.js";
import dateUpdater from "../hbs/helpers/getDate.js";
import { receiveData, modifyScorecards } from "./requests.js";

const getPreviousDate = (date) => {
    const previousMonth = (parseInt(date.split('-')[1]) == 1) ? 12 : parseInt(date.split('-')[1]) -1;
    const previousYear = (previousMonth == 12) ? parseInt(date.split('-')[0]) -1 : parseInt(date.split('-')[0]);
    const formattedMonth = (previousMonth > 9) ? previousMonth : `0${previousMonth}`;

    return `${previousYear}-${formattedMonth}-15T00:00:00Z`;
};

const updateDates = () => {
    const wcaView = document.getElementById('wca-content');

    if (wcaView.classList.contains('create-mode')) {
        wcaView.querySelector('.scorecard-title').innerText = `WCA SCORECARDS, ${utilities.createScorecardTitle()}`;

        utilities.getNodes('.active-content .scorecard-indicator-date').forEach( (i) => {
            const date = i.dataset.date;

            i.value = dateUpdater(date);
        });
    }
};

const createScorecard = () => {
    receiveData(app.storage.settingsURL).then( (result) => {
        document.getElementById('wca-content').innerHTML = wcaCreate(result.d.results);
        document.getElementById('toggle-button').innerHTML = CancelButton();

        document.getElementById('wca-content').classList.add('create-mode', 'active-content');
        document.getElementById('right-buttons').classList.add('vanish');
        document.getElementById('save-button').classList.remove('vanish');
        document.getElementById('date-button').classList.remove('vanish');

        document.getElementById('save-button').removeAttribute('disabled');

        utilities.getNodes('.comment-wrapper').forEach( (i) => {
            new Quill(i.querySelector('.comment-inner'), utilities.editorOptions());
            i.querySelector('.ql-toolbar').classList.add('vanish');
        });
    });
};

const editScorecard = () => {
    receiveData('/api/selectedScorecards.json').then( (result) => { // insert URL to list item id
        const target = document.querySelector('.active-content').id;
        const item = new ScoreCards(result.d.results[0]); // fix, remove [0]

        document.getElementById('toggle-button').innerHTML = CancelButton();
        document.getElementById('right-buttons').classList.add('vanish');
        document.getElementById('save-button').removeAttribute('disabled');

        if (target == "wca-content") {
            document.getElementById('wca-content').innerHTML = wcaEdit(item);

            utilities.getNodes('.comment-wrapper').forEach( (i) => {
                new Quill(i.querySelector('.comment-inner'), utilities.editorOptions());
                i.querySelector('.ql-toolbar').classList.add('vanish');
            });
    
        } else if (target == "hubs-content") {
            console.log('edit-mode');
        }

    });
};

const cancelEdit = () => {
    const target = document.querySelector('.active-content');
    const itemId = target.dataset.id;

    if (target.classList.contains('create-mode')) {
        location.reload();

    } else {
        const url = '/api/selectedScorecards.json';
        
        target.classList.remove('create-mode');
        loadScorecard(url);
    }
};

const loadScorecard = (url) => {
    const target = document.querySelector('.active-content');

    target.classList.remove('create-mode');

    receiveData(url).then( (result) => {
        const selectedScorecard = new ScoreCards(result.d.results[0]);
        const previousScorecard = new ScoreCards(result.d.results[1])

        app.current = selectedScorecard;
        app.previous = previousScorecard;

        document.getElementById('toggle-button').innerHTML = EditButton();
        document.getElementById('date-button').classList.add('vanish');
        document.getElementById('right-buttons').classList.remove('vanish');
        document.getElementById('edit-button').classList.remove('vanish');
        document.getElementById('save-button').classList.remove('vanish');
        document.getElementById('save-button').setAttribute('disabled', 'disabled');

        if (target.id == "wca-content") {
            document.getElementById('wca-content').innerHTML = Wca(selectedScorecard);
            document.getElementById('wca-content').setAttribute('data-id', selectedScorecard.Id);

        } else if (target.id == "hubs-content") {

        } else {

        }
    });
};

const getScorecard = (e) => {
    const selectedDate = e.target.dataset.date;
    const previousDate = getPreviousDate(selectedDate);

    // const site = _spPageContextInfo.webServerRelativeUrl;
    // const url = `${site}/_api/web/lists/getbytitle('${app.storage.scorecardsList}')/items?$filter=((scoredate eq '${selectedDate}') or (scoredate eq '${previousDate}'))&$orderby=scoredate desc`;

    const url = '/api/selectedScorecards.json';

    loadScorecard(url);
};

const headerListeners = () => {
    utilities.on('#scorecards-header', 'change', '#date-button', updateDates);
    utilities.on('#scorecards-header', 'click', '#save-button', modifyScorecards);
    utilities.on('#scorecards-header', 'click', '#cancel-button', cancelEdit);
    utilities.on('#scorecards-header', 'click', '#edit-button', editScorecard);
    utilities.on('#scorecards-header', 'click', '.create-scorecard', createScorecard);
    utilities.on('#scorecards-header', 'click', '.dropdown-item-element', getScorecard);
};

class ScoreCards {
    constructor(sharepointItem) {
		this.Title = sharepointItem.Title;
		this.Id = sharepointItem.Id;
		this.comment = sharepointItem.comment;
		this.motto = sharepointItem.motto;
		this.scoredate = sharepointItem.scoredate;
		this.wcadata = this.formatJSON(sharepointItem.wcadata);
		this.westdata = this.formatJSON(sharepointItem.westdata);
		this.coastaldata = this.formatJSON(sharepointItem.coastaldata);
		this.centraldata = this.formatJSON(sharepointItem.centraldata);
		this.westaction = this.formatJSON(sharepointItem.westaction);
		this.coastalaction = this.formatJSON(sharepointItem.coastalaction);
		this.centralaction = this.formatJSON(sharepointItem.centralaction);
    }

    formatJSON(item) {
        if (item) {
            return Object.values( JSON.parse(item) );

        } else {
            return null;

        }
    };
}

export { Header, headerListeners };