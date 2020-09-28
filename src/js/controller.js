import "quill/dist/quill.snow.css";
import "../css/header.css";
import "../css/wca.css";
import "../css/hubs.css";
import Header from "../hbs/header.hbs";
import Wca from "../hbs/wca.hbs";
import wcaCreate from "../hbs/wcaCreate.hbs";
import wcaEdit from "../hbs/wcaEdit.hbs";
import Hubs from "../hbs/hubs.hbs";
import HubsEdit from "../hbs/hubsEdit.hbs";
import CancelButton from "../hbs/partials/cancelButton.hbs";
import EditButton from "../hbs/partials/editButton.hbs";
import Quill from 'quill';
import utilities from "./utilities.js";
import dateUpdater from "../hbs/helpers/getDate.js";
import { ScoreCardsItem } from "./scorecardsItem.js";
import { HubsItem } from "./hubsItem.js";
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

const toggleView = (e) => {
    const view = e.target.id.split('-')[0];
    const hash = location.hash.split('-');

    location.hash = `${view}-${hash[1]}-${hash[2]}`;
};

const initHubsData = () => {
    const hubs = ['west', 'coastal', 'central'];

    app.settings.forEach( (i) => {
        const code = i.Code;

        const left = document.getElementById(`${code}-hub-row-left`);
        const right = document.getElementById(`${code}-hub-row-right`);

        hubs.forEach( (d) => {
            left.querySelector(`.${d}-indicator-target`).value = i.Target1 ? i.Target1 : "TBD";
            left.querySelector(`.${d}-indicator-date`).value = left.querySelector('.wca-indicator-date').innerText;
            left.querySelector(`.${d}-indicator-old`).value = "N/A";

            right.querySelector(`.${d}-indicator-target`).value = i.Target2 ? i.Target2 : "TBD";
            right.querySelector(`.${d}-indicator-date`).value = right.querySelector('.wca-indicator-date').innerText;
            right.querySelector(`.${d}-indicator-old`).value = "N/A";
        });
    });
};

const highlightCells = (a) => {
    const data = [
        a.westdata ? a.westdata : null, 
        a.coastaldata ? a.coastaldata : null, 
        a.centraldata ? a.centraldata : null
    ];

    app.settings.forEach( (i) => {
        const code = i.Code;

        let leftValues = [];
        let rightValues = [];
        let leftLikelihood = 0;
        let rightLikelihood = 0;
        let leftCounter = 0;
        let rightCounter = 0;

        data.forEach( (k) => {
            leftValues.push( k[code]['value1'] ); // values are either parsable into integers, or empty strings. No need to skip NaNs
            rightValues.push( k[code]['value2'] ); // values are either parsable into integers, or empty strings. No need to skip NaNs

            if (k[code]['likelihood1']) {
                leftLikelihood += k[code]['likelihood1'];
                leftCounter += 1;
            }
            if (k[code]['likelihood2']) {
                rightLikelihood += k[code]['likelihood2'];
                rightCounter += 1;
            }
        });
        utilities.highlightValues(leftValues, code, 1);
        utilities.highlightValues(rightValues, code, 2);
        // console.log(leftLikelihood, leftCounter)
        utilities.highlightLikelihood(leftLikelihood, leftCounter, code, 1);
        utilities.highlightLikelihood(rightLikelihood, rightCounter, code, 2);
    });
};

const editScorecard = () => {
    const url = utilities.getItemURL();

    receiveData(url).then( (result) => {
        const target = document.querySelector('.active-content').id;
        const scorecards = new ScoreCardsItem(result.d.results[0]);

        document.getElementById('toggle-button').innerHTML = CancelButton();
        document.getElementById('right-buttons').classList.add('vanish');
        document.getElementById('save-button').removeAttribute('disabled');

        if (target == "wca-content") {
            document.getElementById('wca-content').innerHTML = wcaEdit(scorecards);

            utilities.getNodes('.comment-wrapper').forEach( (i) => {
                new Quill(i.querySelector('.comment-inner'), utilities.editorOptions());
                i.querySelector('.ql-toolbar').classList.add('vanish');
            });
            !utilities.isHubsDataEmpty() && highlightCells(scorecards);

        } else if (target == "hubs-content") {
            const item = new HubsItem(scorecards);

            document.getElementById('hubs-content').innerHTML = HubsEdit(item);
            utilities.isHubsDataEmpty() && initHubsData();

        } else if (target == "actions-content") {
            console.log('actions-content');
        }

    });
};

const cancelEdit = () => {
    const target = document.querySelector('.active-content');

    if (target.classList.contains('create-mode')) {
        utilities.reload();

    } else {
        const url = utilities.getItemURL();

        target.classList.remove('create-mode');
        loadScorecard(url);
    }
};

const startCreateMode = () => {
    location.hash = "create-mode";
};

const getScorecard = (e) => {
    const date = e.target.dataset.date;
    const newHash = utilities.generateHash(date);

    location.hash = newHash;
};

const loadScorecard = (url) => {
    const target = document.querySelector('.active-content');
    const main = document.getElementById('scorecards-content');

    target.classList.remove('create-mode');

    receiveData(url).then( (result) => {
        const selectedScorecard = new ScoreCardsItem(result.d.results[0]);

        app.current = selectedScorecard;

        main.setAttribute('data-date', selectedScorecard.scoredate);
        main.classList.remove('welcome');

        document.getElementById('right-buttons').classList.remove('vanish');

        utilities.getNodes('.context-button').forEach( (i) => i.removeAttribute('disabled') );

        if (target.id == "wca-content") {
            document.getElementById('wca-view').setAttribute('disabled', 'disabled');
            document.getElementById('wca-content').innerHTML = Wca(selectedScorecard);

        } else if (target.id == "hubs-content") {
            const hubsData = new HubsItem(selectedScorecard);

            document.getElementById('hubs-view').setAttribute('disabled', 'disabled');
            document.getElementById('hubs-content').innerHTML = Hubs(hubsData);
        } else {

        }

        if (app.admin) {
            document.getElementById('toggle-button').innerHTML = EditButton();
            document.getElementById('date-button').classList.add('vanish');
            document.getElementById('edit-button').classList.remove('vanish');
            document.getElementById('save-button').classList.remove('vanish');
            document.getElementById('save-button').setAttribute('disabled', 'disabled');
        }
    });
};

const createScorecard = () => {
    receiveData(app.storage.settingsURL).then( (result) => {
        document.getElementById('wca-content').innerHTML = wcaCreate(result.d.results);
        document.getElementById('toggle-button').innerHTML = CancelButton();

        document.getElementById('scorecards-content').classList.remove('welcome');

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

const appController = () => {
    const hash = location.hash;
    const validateHash = utilities.validateHash();

    utilities.getNodes('.scorecards-container').forEach( (i) => {
        i.classList.remove('active-content');
        i.classList.add('vanish');
    });
    // utilities.getNodes('.context-button').forEach( (i) => i.classList.remove('') ); // specify action-button's class

    if (hash == "#create-mode") {
        document.getElementById('wca-content').classList.add('active-content');
        document.getElementById('wca-content').classList.remove('vanish');

        app.admin ? createScorecard() : ( location.href = "" );

    } else if (validateHash) {
        const target = hash.split('-')[0];
        const view = utilities.generateView(hash)[0];
        const date = utilities.generateView(hash)[1];
        const url = utilities.getItemURL(date);

        document.getElementById(view).classList.add('active-content');
        document.getElementById(view).classList.remove('vanish');

        // if (view == "actions-content") {
        //     document.getElementById(target).classList.add('active-action');
        // }

        loadScorecard(url);

    } else if (hash == "") {
        document.getElementById('wca-content').classList.add('active-content');
        document.getElementById('wca-content').classList.remove('vanish');

        // set back landing page

    } else {
        location.href = "";
    }
};

const headerListeners = () => {
    window.addEventListener('hashchange', appController);

    utilities.on('#scorecards-header', 'keydown', '#date-button', utilities.preventDefault);
    utilities.on('#scorecards-header', 'change', '#date-button', updateDates);
    utilities.on('#scorecards-header', 'click', '#save-button', modifyScorecards);
    utilities.on('#scorecards-header', 'click', '#cancel-button', cancelEdit);
    utilities.on('#scorecards-header', 'click', '#edit-button', editScorecard);
    utilities.on('#scorecards-header', 'click', '.create-scorecard', startCreateMode);
    utilities.on('#scorecards-header', 'click', '.context-button', toggleView)
    utilities.on('#scorecards-header', 'click', '.dropdown-item-element', getScorecard);
};

export { Header, headerListeners, appController };