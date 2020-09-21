import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/main.css";
import { receiveData } from "./js/requests.js";
import { App, Admin } from "./js/app.js";
import { scorecardsListeners } from "./js/scorecards.js";
import { Modal, modalListeners } from "./js/settings.js";
import { Header, headerListeners } from "./js/header.js";

const settingsListColumns = ["Position", "Color", "Code", "Id", "Title", "Value1", "Value2", "Target1", "Target2", "Range1", "Range2"];
const scorecardsListColumns = ["scoredate", "Id", "Title"];

const data = {
    settingsList: 'scorecards-settings-v2',
    scorecardsList: 'scorecards-data-v2',
    site: _spPageContextInfo.webServerRelativeUrl,
    userData: `${_spPageContextInfo.webServerRelativeUrl}/_api/web/currentuser/?$expand=groups`,
    settingsData: `${_spPageContextInfo.webServerRelativeUrl}/_api/web/lists/getbytitle('scorecards-settings-v2')/items?$select=${settingsListColumns.join()}&$orderby=Position asc`,
    scorecardsData: `${_spPageContextInfo.webServerRelativeUrl}/_api/web/lists/getbytitle('scorecards-data-v2')/items?$select=${scorecardsListColumns.join()}&$orderby=scoredate desc`,
    scorecardsMetadata: `${_spPageContextInfo.webServerRelativeUrl}/_api/web/lists/getbytitle('scorecards-data-v2')`
    // userData: '/api/user.json',
    // settingsData: '/api/settings.json',
    // scorecardsData: '/api/scorecards.json',
    // scorecardsMetadata: '/api/scorecardsList.json'
};

receiveData(data.userData).then( (user) => {
    data.isAdmin = !!user.d.Groups.results.filter( (i) => (i.Title == "Tools Owners")).length;

    receiveData(data.settingsData).then( (settingsResult) => {
        data.settings = settingsResult.d.results;

        receiveData(data.scorecardsData).then( (scorecardsResult) => {
            data.scorecards = scorecardsResult.d.results;

            if (!data.scorecards.length) {
                receiveData(data.scorecardsMetadata).then( (metadataResult) => {
                    data.scorecardsType = metadataResult.d.ListItemEntityTypeFullName;

                    initApp();
                });

            } else {
                data.scorecardsType = data.scorecards[0].__metadata.type;

                initApp();
            }
        });
    });
});

function headerData(data) {
    const date = data[0].scoredate.split('-');
    const year = date[0];
    const month = parseInt(date[1]) + 1;
    const updatedMonth = month > 9 ?  month : `0${month}`;

    return {
        scorecards: data,
        minDate: `${year}-${updatedMonth}`
    };
};

function updateSPToken () {
    setInterval( () => {
        UpdateFormDigest(_spPageContextInfo.webServerRelativeUrl, _spFormDigestRefreshInterval);
    }, 15 * 60000);
};

function initApp() {
    document.getElementById("scorecards-header").innerHTML = Header( headerData(data.scorecards) );

    headerListeners();
    scorecardsListeners();
    updateSPToken();

    if (data.isAdmin) {
        window.app = new Admin(data);

        document.getElementById("scorecards-dialog").innerHTML = Modal(data.settings);
        modalListeners();

    } else {
        window.app = new App(data);

        document.querySelector('.navbar-collapse').remove();
    }
};