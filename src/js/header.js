import "quill/dist/quill.snow.css";
import "../css/header.css";
import "../css/wca.css";
import Header from "../hbs/header.hbs";
import WcaEdit from "../hbs/wcaEdit.hbs";
import CancelButton from "../hbs/partials/cancelButton.hbs";
import EditButton from "../hbs/partials/editButton.hbs";
import Quill from 'quill';
import utilities from "./utilities.js";
import { receiveData } from "./requests.js";

const createScorecard = (e) => {
    receiveData(app.storage.settingsURL).then( (result) => {
        document.getElementById('wca-content').innerHTML = WcaEdit(result.d.results);
        document.getElementById('toggle-button').innerHTML = CancelButton();

        document.getElementById('save-button').classList.remove('vanish');
        document.getElementById('date-button').classList.remove('vanish');

        utilities.getNodes('.comment-wrapper').forEach( (i) => {
            new Quill(i.querySelector('.comment-inner'), utilities.editorOptions());
            i.querySelector('.ql-toolbar').classList.add('vanish');
        });
    });
};

const headerListeners = () => {
    utilities.on('#scorecards-header', 'click', '.create-scorecard', createScorecard);
};

export { Header, headerListeners };