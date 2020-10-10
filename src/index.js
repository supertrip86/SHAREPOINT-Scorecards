import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/main.css";
import utilities from './js/utilities';
import { receiveData } from "./js/requests.js";
import { App, Admin } from "./js/app.js";
import { scorecardsListeners } from "./js/scorecards.js";
import { actionsListeners } from "./js/actions.js";
import { Modal, modalListeners } from "./js/settings.js";
import { Header, ActionsPanel, headerListeners, appController } from "./js/controller.js";

const settingsListColumns = ["Position", "Color", "Code", "Id", "Title", "Value1", "Value2", "Target1", "Target2", "Range1", "Range2"];
const scorecardsListColumns = ["scoredate", "Id", "Title"];
const scorecardsSettings = 'scorecards-settings-v2';
const scorecardsData = 'scorecards-data-v2';
const scorecardsManagement = 'scorecards-management';

const data = {
    settingsList: scorecardsSettings,
    scorecardsList: scorecardsData,
    managementList: scorecardsManagement,
    site: _spPageContextInfo.webAbsoluteUrl,
    userData: `${_spPageContextInfo.webAbsoluteUrl}/_api/web/currentuser/?$expand=groups`,
    allUsers: `${_spPageContextInfo.webAbsoluteUrl}/_api/web/siteusers?$select=Title,Email,LoginName`,
    settingsData: `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getbytitle('${scorecardsSettings}')/items?$select=${settingsListColumns.join()}&$orderby=Position asc`,
    scorecardsMetadata: `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getbytitle('${scorecardsData}')`,
    scorecardsData: `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getbytitle('${scorecardsData}')/items?$select=${scorecardsListColumns.join()}&$orderby=scoredate desc`,
    scorecardsManagement: `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getbytitle('${scorecardsManagement}')/items?$select=Title,Full_x0020_Name,FileLeafRef,FileRef`
};

receiveData(data.userData).then( (user) => {
    data.person = user.d.Title;
    data.isAdmin = !!user.d.Groups.results.filter( (i) => (i.Title == "Tools Owners")).length;
    data.isOwner = (data.isAdmin && (data.person == "Leguia Alegria, Juan Jose" || data.person == "Giunta, Giovanni")) ? true : false;

    receiveData(data.settingsData).then( (settingsResult) => {
        data.settings = settingsResult.d.results;

        receiveData(data.scorecardsData).then( (scorecardsResult) => {
            data.scorecards = scorecardsResult.d.results;

            receiveData(data.allUsers).then( (allUsers) => {
                data.usersList = utilities.getAllUsers(allUsers.d.results);

                receiveData(data.scorecardsManagement).then( (management) => {
                    data.management = utilities.getManagement(management.d.results);

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
    });
});

function initApp() {
    if (data.isAdmin) {
        window.app = new Admin(data);

        document.getElementById("scorecards-dialog").innerHTML = Modal(data.settings);
        modalListeners();

    } else {
        window.app = new App(data);
    }

    document.getElementById("scorecards-header").innerHTML = Header( utilities.getHeaderData() );
    document.getElementById("actions-content").innerHTML = ActionsPanel(app.owner);

    utilities.updateSPToken();

    headerListeners();
    scorecardsListeners();
    actionsListeners();
    appController();
};