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

const saveData = (id) => {
    const scorecardsList = app.storage.scorecardsList;
    const url = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/GetByTitle('${scorecardsList}')/items${id ? `(${id})` : ``}`;

    const item = new ScoreCard();

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

    fetch(url, options).then( () => location.reload() );
};

const deleteData = (id) => {
    const scorecardsList = app.storage.scorecardsList;
    const url = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getbytitle('${scorecardsList}')/items(${id})/recycle()`;

    const options = {
        method: "DELETE",
        credentials: "same-origin",
        headers: {
            "X-RequestDigest": document.getElementById('__REQUESTDIGEST').value
        }
    };

    utilities.startLoader();

    fetch(url, options).then( () => location.reload() );
};

const modifySettings = (id) => {
    const settingsList = app.storage.settingsList;
    const url = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/GetByTitle('${settingsList}')/items(${id})`;

    const item = new SettingsItem();

    const options = {
        method: "POST",
        credentials: "same-origin",
        headers: { 
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-Http-Method": "MERGE",
            "IF-MATCH": "*",
            "X-RequestDigest": document.getElementById('__REQUESTDIGEST').value
        },
        body: JSON.stringify(item)
    };

    utilities.startLoader();

    fetch(url, options).then( () => location.reload() );
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
    // setup
    constructor() {
        this.interventions = this.getInterventions();
        this.outcomes = this.getOutcomes();
        this.__metadata = { type: this.getMetadataType() };
    }
    getInterventions() {
        const DOMelements = Array.from(document.querySelectorAll('.modal-intervention-title input'));
        const items = DOMelements.map( (i, j) => { return {Title: i.value, Id: (j + 1), Color: i.dataset.color} } );

        return JSON.stringify(items);
    }
    getOutcomes() {
        const DOMelements = Array.from(document.querySelectorAll('.modal-outcome-title input'));
        const items = DOMelements.map( (i, j) => { return {Title: i.value, Id: (j + 1)} } );

        return JSON.stringify(items);
    }
    getMetadataType() {
        return gapmap.data.storage.settingsMetadata;
    }
}

export { receiveData, saveData, deleteData, modifySettings };