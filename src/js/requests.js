import utilities from "../js/utilities.js";
import { display } from "../js/errorHandler.js";

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

const saveData = (context, item, index, id) => {
    const list = (context == "Scorecard") ? app.storage.scorecardsList : app.storage.settingsList;
    const url = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/GetByTitle('${list}')/items${id ? `(${id})` : ``}`;

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
            location.reload();
        }
    });
};

const modifySettings = () => {
    utilities.getNodes('.dialog-menu-item').forEach( (i, index) => {
        const id = i.dataset.id;
        const form = document.querySelector(`.dialog-form-item[data-id="${id}"]`);
        const item = new SettingsItem(form, index);

        saveData("Settings", item, index, id);
    });
};

const modifyScorecards = () => {
    const target = document.querySelector('.active-content');

    if (target.classList.contains('create-mode')) {
        console.log('create')
    } else {
        const context = target.id;
        const id = target.dataset.id;
        console.log(context, id)
    }
};

class ScoreCard {
    // setup
    constructor() {
        this.Title = utilities.get.getValue(`.attachment-title`, this.getContext());
        this.label = utilities.get.getValue(`.attachment-title`, this.getContext());
        this.value = utilities.get.getValue(`.attachment-title`, this.getContext());
        this.Evidence = utilities.get.getValue(`.modal-evidence select option:checked`, this.getContext());
        this.Language = utilities.get.getValue(`.modal-language option:checked`, this.getContext());
        this.Date = utilities.get.getDate(`.modal-datepicker`, this.getContext());
        this.Author0 = utilities.get.getValue(`.modal-author`, this.getContext());
        this.Study = utilities.get.getValue(`.modal-study`, this.getContext());
        this.Data = this.getData();
        this.__metadata = { type: this.getMetadataType() };
    }
    getContext() {
        return utilities.currentContext();
    }
    getData() {
        const data = [];
        const context = `#${this.getContext().id} .card-resource`;

        utilities.get.getNodeList(context).forEach( (i) => {
            const item = {
                Region: utilities.get.getOptions('.modal-region', i),
                Country: utilities.get.getOptions('.modal-country', i),
                Impact: utilities.get.getValue(`.modal-impact option:checked`, i),
                Population: utilities.get.getValue(`.modal-population`, i),
                Metrics: utilities.get.getValue(`.modal-metrics`, i),
                Paragraphs: utilities.get.getValue(`.modal-paragraphs`, i),
                Intervention: utilities.get.getValue(`.modal-intervention select option:checked`, i),
                Outcome: utilities.get.getValue(`.modal-outcome select option:checked`, i),
                Description: utilities.get.getHTML(`.editor .ql-editor`, i)
            };

            data.push(item);
        });

        return JSON.stringify(data);
    }
    getMetadataType() {
        return gapmap.data.storage.resourceMetadata;
    }
}

class SettingsItem {
    constructor(form, index) {
        this.Title = form.querySelector('.modal-edit-title').value.trim();
        this.Position = parseInt(index);
        this.Color = form.querySelector('.modal-edit-color').value.trim();
        this.Value1 = form.querySelector('.modal-edit-indicator1').value.trim();
        this.Target1 = parseInt(form.querySelector('.modal-edit-target1').value.trim());
        this.Range1 = form.querySelector('.modal-edit-time1').value.trim();
        this.Value2 = form.querySelector('.modal-edit-indicator2').value.trim();
        this.Target2 = parseInt(form.querySelector('.modal-edit-target2').value.trim());
        this.Range2 = form.querySelector('.modal-edit-time2').value.trim();
        this.__metadata = { type: app.storage.settingsType };
    }
}

export { receiveData, modifySettings, modifyScorecards };