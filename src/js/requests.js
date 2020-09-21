import utilities from "../js/utilities.js";
import { display } from "./errors.js";
import { ScoreCards } from "./scorecardsItem.js";
import { ScoreCardItem } from "./scorecardsItemSP.js";
import { SettingsItem } from "./settingsItemSP.js";

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
            index == threshold && location.reload();

        } else {
            // location.reload();
        }
    });
};

const modifySettings = () => {
    utilities.getNodes('.dialog-menu-item').forEach( (i, index) => {
        const id = i.dataset.id;
        const form = document.querySelector(`.dialog-form-item[data-id="${id}"]`);
        const item = new SettingsItem(form, index);

        saveData("Settings", item, id, index);
    });
};

const modifyScorecards = () => {
    const target = document.querySelector('.active-content');
    const context = target.id;
    const createMode = target.classList.contains('create-mode');

    if (createMode) {
        const item = new ScoreCardItem(target, context, createMode);

        saveData('Scorecard', item);

    } else {
        const url = utilities.getItemURL();
        const start = new Date();

        receiveData(url).then( (result) => {
            const retrieved = new ScoreCards(result.d.results[0]);
            const previous = app.current;
            const id = retrieved.Id;

            if (context == "wca-content") {
                const data = new ScoreCardItem(retrieved, previous, context, createMode);
                console.log(data);
                // rethink ScoreCardItem, check what already uses ScoreCardItem, then create ScoreCardItem with "data"
                // saveData('Scorecard', data, id);

            } else if (context == "hubs-content") {

            } else if (context == "actions-content") {

            }
        });
    }
};

export { receiveData, modifySettings, modifyScorecards };