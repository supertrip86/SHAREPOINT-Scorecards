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
import { ScoreCards } from "./scorecardsItem.js";
import { receiveData, modifyScorecards } from "./requests.js";

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
    const url = utilities.getItemURL();
    // const url = '/api/selectedScorecards.json'; // modify!!!

    receiveData(url).then( (result) => {
        const target = document.querySelector('.active-content').id;
        const item = new ScoreCards(result.d.results[0]);

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

        } else if (target == "actions-content") {
            console.log('actions-content');
        }

    });
};

const cancelEdit = () => {
    const target = document.querySelector('.active-content');

    if (target.classList.contains('create-mode')) {
        location.reload();

    } else {
        const url = utilities.getItemURL();
        // const url = '/api/selectedScorecards.json'; // modify!!!

        target.classList.remove('create-mode');
        loadScorecard(url);
    }
};

const loadScorecard = (url) => {
    const target = document.querySelector('.active-content');

    target.classList.remove('create-mode');

    receiveData(url).then( (result) => {
        const selectedScorecard = new ScoreCards(result.d.results[0]);

        app.current = selectedScorecard;

        document.getElementById('toggle-button').innerHTML = EditButton();
        document.getElementById('date-button').classList.add('vanish');
        document.getElementById('right-buttons').classList.remove('vanish');
        document.getElementById('edit-button').classList.remove('vanish');
        document.getElementById('save-button').classList.remove('vanish');
        document.getElementById('save-button').setAttribute('disabled', 'disabled');
        document.getElementById('scorecards-content').setAttribute('data-date', selectedScorecard.scoredate);

        if (target.id == "wca-content") {
            document.getElementById('wca-content').innerHTML = Wca(selectedScorecard);

        } else if (target.id == "hubs-content") {

        } else {

        }
    });
};

const getScorecard = (e) => {
    const date = e.target.dataset.date;
    const url = utilities.getItemURL(date);
    // const selectedDate = e.target.dataset.date;
    // const previousDate = utilities.getPreviousDate(selectedDate);
    // const url = `${app.storage.site}/_api/web/lists/getbytitle('${app.storage.scorecardsList}')/items?$filter=((scoredate eq '${selectedDate}') or (scoredate eq '${previousDate}'))&$orderby=scoredate desc`;
    // const url = '/api/selectedScorecards.json';

    loadScorecard(url);
};

const headerListeners = () => {
    utilities.on('#scorecards-header', 'keydown', '#date-button', utilities.preventDefault);
    utilities.on('#scorecards-header', 'change', '#date-button', updateDates);
    utilities.on('#scorecards-header', 'click', '#save-button', modifyScorecards);
    utilities.on('#scorecards-header', 'click', '#cancel-button', cancelEdit);
    utilities.on('#scorecards-header', 'click', '#edit-button', editScorecard);
    utilities.on('#scorecards-header', 'click', '.create-scorecard', createScorecard);
    utilities.on('#scorecards-header', 'click', '.dropdown-item-element', getScorecard);
};

export { Header, headerListeners };