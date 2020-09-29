import utilities from "../js/utilities.js";
import { display } from "./errors.js";
import { ScoreCardsItem } from "./scorecardsItem.js";
import { ScoreCardsItemSP } from "./scorecardsItemSP.js";
import { SettingsItemSP } from "./settingsItemSP.js";

const receiveData = async (url) => {
    const options = {
        method: "GET",
        credentials: "same-origin",
        headers: {"Accept": "application/json;odata=verbose"}
    };

    const response = await fetch(url, options);

    if (response.status == 404) {
        return display('dataNotFound', false);
    }

    return await response.json();
};

const saveData = (context, item, id, index) => {
    const list = (context == "Scorecard") ? app.storage.scorecardsList : app.storage.settingsList;
    const url = `${app.storage.site}/_api/web/lists/GetByTitle('${list}')/items${id ? `(${id})` : ``}`;

    const options = {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": document.getElementById('__REQUESTDIGEST').value
        },
        body: JSON.stringify(item)
    };

    if (id) {
        options.headers["IF-MATCH"] = "*";
        options.headers["X-Http-Method"] = "MERGE";
    }

    utilities.startLoader();

    fetch(url, options).then( () => {
        if (context == "Settings") {
            const threshold = document.querySelectorAll('.dialog-menu-item').length -1;
            index == threshold && utilities.reload();

        } else {
            utilities.reload();
        }
    });
};

const modifySettings = () => {
    utilities.getNodes('.dialog-menu-item').forEach( (i, index) => {
        const id = i.dataset.id;
        const form = document.querySelector(`.dialog-form-item[data-id="${id}"]`);
        const item = new SettingsItemSP(form, index);

        saveData("Settings", item, id, index);
    });
};

const modifyScorecards = () => {
    const target = document.querySelector('.active-content');
    const context = target.id;
    const createMode = target.classList.contains('create-mode');

    if (createMode) {
        const item = new ScoreCardsItemSP(null, null, context, createMode);

        saveData('Scorecard', item);

    } else {
        const url = utilities.getItemURL();

        receiveData(url).then( (result) => {
            const retrieved = new ScoreCardsItem(result.d.results[0]);
            const previous = app.current;
            const id = retrieved.Id;
            // maybe get rid of if else 
            if (context == "wca-content") {
                const data = new ScoreCardsItemSP(retrieved, previous, context, createMode);

                saveData('Scorecard', data, id);

            } else if (context == "hubs-content") {
                const data = new ScoreCardsItemSP(retrieved, previous, context, utilities.isHubsDataEmpty());

                saveData('Scorecard', data, id);

            } else if (context == "actions-content") {

            }
        });
    }
};

export { receiveData, modifySettings, modifyScorecards };