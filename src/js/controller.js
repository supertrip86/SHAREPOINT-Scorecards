import "quill/dist/quill.snow.css";
import "../css/header.css";
import "../css/wca.css";
import "../css/hubs.css";
import Header from "../hbs/header.hbs";
import Wca from "../hbs/wca.hbs";
import wcaCreate from "../hbs/wcaCreate.hbs";
import wcaEdit from "../hbs/wcaEdit.hbs";
import Hubs from "../hbs/hubs.hbs";
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

const editScorecard = () => {
    const url = utilities.getItemURL();
    // const url = '/api/selectedScorecards.json'; // modify!!!

    receiveData(url).then( (result) => {
        const target = document.querySelector('.active-content').id;
        const item = new ScoreCardsItem(result.d.results[0]);

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
        utilities.reload();

    } else {
        const url = utilities.getItemURL();
        // const url = '/api/selectedScorecards.json'; // modify!!!

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

    if (hash == "#create-mode") {
        app.admin ? createScorecard() : ( location.href = "" );

    } else if (hash == "") {
        // document.getElementById('scorecards-content').classList.add('welcome');

    } else {
        const target = hash.split('-')[0];
        const view = utilities.generateView(hash)[0];
        const date = utilities.generateView(hash)[1];
        const url = utilities.getItemURL(date);

        utilities.getNodes('.scorecards-container').forEach( (i) => {
            i.classList.remove('active-content');
            i.classList.add('vanish');
        });
        // utilities.getNodes('.context-button').forEach( (i) => i.classList.remove('') ); // specify action-button's class

        document.getElementById(view).classList.add('active-content');
        document.getElementById(view).classList.remove('vanish');

        // if (view == "actions-content") {
        //     document.getElementById(target).classList.add('active-action');
        // }

        loadScorecard(url);
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