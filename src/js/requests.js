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
    const context = target.id;

    if (target.classList.contains('create-mode')) {
        const item = new ScoreCardItem(target, context);

        saveData('Scorecard', item);

    } else {
        // receiveData + check (set context so that it only modifies menaningful columns)
    }
};

class ScoreCardItem {
    constructor(form, context) {
        this.Title = utilities.createScorecardTitle();
        this.scoredate = utilities.fromDateToSP();
        this.comment = form.querySelector('.scorecard-main-summary .ql-editor').innerHTML;
        this.motto = form.querySelector('.scorecard-motto').value;
        this.__metadata = { type: app.storage.scorecardsType };

        (context == "wca-content") && (this.wcadata = this.getWca());
    }

    getWca() {
        const filterOut = (value) => isNaN(parseInt(value)) ? "" : value;

        let wca = {};

        utilities.getNodes('.active-content .scorecard-row').forEach( (i) =>  {
            wca[i.dataset.code] = {};

            wca[i.dataset.code]['description'] = i.querySelector('.ql-editor').innerHTML;
            wca[i.dataset.code]['title'] = i.querySelector('.scorecard-edit-title').value;
            wca[i.dataset.code]['indicator1'] = i.querySelector('.scorecard-indicator-title-1').value;
            wca[i.dataset.code]['indicator2'] = i.querySelector('.scorecard-indicator-title-2').value;
            wca[i.dataset.code]['value1'] = filterOut(i.querySelector('.scorecard-indicator-value-1').value);
            wca[i.dataset.code]['value2'] = filterOut(i.querySelector('.scorecard-indicator-value-2').value);
            wca[i.dataset.code]['target1'] = filterOut(i.querySelector('.scorecard-indicator-target-1').value);
            wca[i.dataset.code]['target2'] = filterOut(i.querySelector('.scorecard-indicator-target-2').value);
            wca[i.dataset.code]['date1'] = i.querySelector('.scorecard-indicator-date-1').value;
            wca[i.dataset.code]['date2'] = i.querySelector('.scorecard-indicator-date-2').value;
            wca[i.dataset.code]['old1'] = filterOut(i.querySelector('.scorecard-indicator-old-1').value);
            wca[i.dataset.code]['old2'] = filterOut(i.querySelector('.scorecard-indicator-old-2').value);
            wca[i.dataset.code]['arrow1'] = utilities.fromArrowToSP(i.querySelector('.scorecard-indicator-arrow-1'));
            wca[i.dataset.code]['arrow2'] = utilities.fromArrowToSP(i.querySelector('.scorecard-indicator-arrow-2'));
            wca[i.dataset.code]['likelihood1'] = utilities.fromLikelihoodToSP(i.querySelector('.scorecard-likelihood-1 .line'));
            wca[i.dataset.code]['likelihood2'] = utilities.fromLikelihoodToSP(i.querySelector('.scorecard-likelihood-2 .line'));
            wca[i.dataset.code]['color'] = i.dataset.color;
        });

        return JSON.stringify(wca);
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