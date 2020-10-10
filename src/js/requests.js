import utilities from "../js/utilities.js";
import { display } from "./alert.js";
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
        return display({value: 'dataNotFound', title: 'Data not found!', icon: 'error', confirm: false});
    }

    return await response.json();
};

const saveData = (context, item, id, index, createMode) => {
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
            (index == threshold) && location.reload();

        } else {
            createMode ? utilities.reload() : location.reload();
        }
    });
};

const sendEmail = (data) => {
    const url = `${app.storage.site}/_api/SP.Utilities.Utility.SendEmail`;
    const item = {
        'properties': {
            '__metadata': {
                'type': 'SP.Utilities.EmailProperties'
            },
            'From': 'wcascorecards_team@ifad.org',
            'To': {
                'results': data.to
            },
            'Body': data.body,
            'Subject': data.subject
        }
    };
    const options = {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-RequestDigest": document.getElementById('__REQUESTDIGEST').value
        },
        body: JSON.stringify(item)
    };

    utilities.startLoader();

    fetch(url, options).then( () => {
        !data.counter && location.reload();
    });
};

const validateActions = () => {
    let proceed = true;

    utilities.getNodes('.active-action .action-element').forEach( (i) => {
        const isLead = i.classList.contains('action-lead');

        if ( isLead && i.querySelector('.select-pure__label').innerText == "" ) {
            i.querySelector('.select-pure__select').style.border = "1px solid red";
            proceed = false;

        } else if ( !isLead && i.value == "" ) {
            i.style.border = "1px solid red";
            proceed = false;
        }
    });

    return proceed;
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
    const view = target.id.split('-')[0];
    const context = (view != "actions") ? view : document.querySelector('.active-action').id.split('-')[0];
    const proceed = (view == "actions") && !validateActions();
    const createMode = target.classList.contains('create-mode');

    if (proceed) {
        display({value: 'missingData', title: 'Warning', icon: 'warning', confirm: false});

    } else if (createMode) {
        const item = new ScoreCardsItemSP(null, null, null, context, true);

        saveData('Scorecard', item, null, null, createMode);

    } else {
        const url = utilities.getItemURL();

        receiveData(url).then( (result) => {
            const retrieved = new ScoreCardsItem(result.d.results[0]);
            const previous = app.current;
            const previousOld = result.d.results[1] ? new ScoreCardsItem(result.d.results[1]) : null;
            const id = retrieved.Id;
            const isCreate = utilities.getSaveMode(context, retrieved);
            const data = new ScoreCardsItemSP(retrieved, previous, previousOld, context, isCreate);

            saveData('Scorecard', data, id);
        });
    }
};

export { receiveData, modifySettings, modifyScorecards, sendEmail };