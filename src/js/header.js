import "quill/dist/quill.snow.css";
import "../css/header.css";
import "../css/wca.css";
import Header from "../hbs/header.hbs";
import Wca from "../hbs/wca.hbs";
import WcaEdit from "../hbs/wcaEdit.hbs";
import CancelButton from "../hbs/partials/cancelButton.hbs";
import EditButton from "../hbs/partials/editButton.hbs";
import Quill from 'quill';
import utilities from "./utilities.js";
import { receiveData, modifyScorecards } from "./requests.js";

const getPreviousDate = (date) => {
    const previousMonth = (parseInt(date.split('-')[1]) == 1) ? 12 : parseInt(date.split('-')[1]) -1;
    const previousYear = (previousMonth == 12) ? parseInt(date.split('-')[0]) -1 : parseInt(date.split('-')[0]);
    const formattedMonth = (previousMonth > 9) ? previousMonth : `0${previousMonth}`;

    return `${previousYear}-${formattedMonth}-15T00:00:00Z`;
};

const createScorecard = (e) => {
    receiveData(app.storage.settingsURL).then( (result) => {
        document.getElementById('wca-content').innerHTML = WcaEdit(result.d.results);
        document.getElementById('toggle-button').innerHTML = CancelButton();

        document.getElementById('wca-content').classList.add('create-mode', 'active-content');
        document.getElementById('save-button').classList.remove('vanish');
        document.getElementById('date-button').classList.remove('vanish');

        utilities.getNodes('.comment-wrapper').forEach( (i) => {
            new Quill(i.querySelector('.comment-inner'), utilities.editorOptions());
            i.querySelector('.ql-toolbar').classList.add('vanish');
        });
    });
};

const cancelEdit = () => {
    const target = document.querySelector('.active-content');

    if (target.classList.contains('create-mode')) {
        location.reload();

    } else {
        console.log('edit-mode');
    }
};

const loadScorecard = (e) => {
    const selectedDate = e.target.dataset.date;
    const previousDate = getPreviousDate(selectedDate);

    // const site = _spPageContextInfo.webServerRelativeUrl;
    // const url = `${site}/_api/web/lists/getbytitle('${app.storage.scorecardsList}')/items?$filter=((scoredate eq '${selectedDate}') or (scoredate eq '${previousDate}'))&$orderby=scoredate desc`;

    const url = '/api/selectedScorecards.json';

    receiveData(url).then( (result) => {
        const selectedScorecard = new ScoreCards(result.d.results[0]);
        console.log(selectedScorecard)
        document.getElementById('wca-content').innerHTML = Wca(selectedScorecard);
        document.getElementById('wca-content').setAttribute('data-id', selectedScorecard.Id);
    });
};

const headerListeners = () => {
    utilities.on('#scorecards-header', 'click', '#save-button', modifyScorecards);
    utilities.on('#scorecards-header', 'click', '#cancel-button', cancelEdit);
    utilities.on('#scorecards-header', 'click', '.create-scorecard', createScorecard);
    utilities.on('#scorecards-header', 'click', '.dropdown-item-element', loadScorecard);
};

class ScoreCards {
    constructor(sharepointItem) {
		this.Title = sharepointItem.Title;
		this.Id = sharepointItem.Id;
		this.comment = sharepointItem.comment;
		this.motto = sharepointItem.motto;
		this.scoredate = sharepointItem.scoredate;
		this.wca = this.formatJSON(sharepointItem.wcadata);
		this.west = this.formatJSON(sharepointItem.westdata);
		this.coast = this.formatJSON(sharepointItem.coastaldata);
		this.central = this.formatJSON(sharepointItem.centraldata);
		this.westAction = this.formatJSON(sharepointItem.westaction);
		this.coastAction = this.formatJSON(sharepointItem.coastalaction);
		this.centralAction = this.formatJSON(sharepointItem.centralaction);
    }

    formatJSON(item) {
        return Object.values( JSON.parse(item) );
    };
}

export { Header, headerListeners };