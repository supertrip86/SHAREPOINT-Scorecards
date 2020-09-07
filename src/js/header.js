import "../css/header.css";
import "../css/wca.css";
import Header from "../hbs/header.hbs";
import WcaEdit from "../hbs/wcaEdit.hbs";
import utilities from "./utilities.js";
import { receiveData } from "./requests.js";

const createScorecard = (e) => {
    receiveData(app.storage.settingsURL).then( (result) => {
        console.log(result.d.results)
        document.getElementById('wca-content').innerHTML = WcaEdit(result.d.results);
    });
};

const headerListeners = () => {
    utilities.on('#scorecards-header', 'click', '.create-scorecard', createScorecard);
};

export { Header, headerListeners };