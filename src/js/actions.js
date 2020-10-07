import ActionsElement from "../hbs/partials/actionsElement.hbs";
import SelectPure from "select-pure";
import utilities from "./utilities.js";
import { display } from "./alert.js";

const clearStyle = (e) => {
    e.target.removeAttribute('style');
};

const toggleAction = (e) => {
    const hash = location.hash.split('-');
    const view = e.target.id.split('-')[0];

    location.hash = `${view}-${hash[1]}-${hash[2]}`;
};

const addAction = (e) => {
    const target = e.target.parentElement;
    const container = target.querySelector('.action-elements');
    const code = target.id.split('-')[0];
    const index = parseInt(target.dataset.max) + 1;
    const actionsData = {Index: index, Code: code};
    const options = utilities.userSelectOptions(app.users);

    target.dataset.max = index;
    container.insertAdjacentHTML( 'beforeend', ActionsElement(actionsData) );

    new SelectPure(container.querySelector('.responsive-element:last-child .action-lead'), options);
};

const removeAction = (e) => {
    const target = e.target.parentElement;
    const id = target.dataset.code;

    !target.classList.contains('new-action') && app.deletedActions.push(id);
    target.remove();
};

const sendNotification = (e) => {

    return display('sendNotification', true);
};

const sendActions = () => {
    const validateSend = document.querySelectorAll('.active-action .responsive-element').length > 0;

    validateSend && display('sendActions', true);
};

const createExcelSheet = (wb, actionObj, sheetName) => {
    // excel file constructor global variables in /dist/excelWriter.js
    let ws = {};
    let rowCounter = 3;
    let actionFields = utilities.getActionFields();
    let rowWidth = utilities.excelStyleOptions()["rowWidth"];
    let rowHeight = utilities.excelStyleOptions()["rowHeight"];
    let firstRow = utilities.excelStyleOptions()["firstRow"];
    let header = utilities.excelStyleOptions()["header"];
    let subHeader = utilities.excelStyleOptions()["subHeader"];
    let row = utilities.excelStyleOptions()["row"];

    mergeCells(ws, "A1", String.fromCharCode(96 + actionFields.length).toUpperCase() + "1");
    fillCellByAddress(wb, ws, sheetName, "Project-level assesment", createObjectRowCol(1,1), firstRow, 'string');

    for (let c = 1; c <= actionFields.length; c++) {
        fillCellByAddress(wb, ws, sheetName, actionFields[c-1], createObjectRowCol(2,c), header, 'string');
    }

    for (let d = 0; d < Object.keys(actionObj).length; d++) {
        let itemTitle = Object.keys(actionObj)[d];
        let rowNumber = Object.values(actionObj[itemTitle]).length;

        fillCellByAddress(wb, ws, sheetName, itemTitle, createObjectRowCol(rowCounter,1), subHeader, 'string');
        rowWidth.push({"hpx": 12});

        for (let c = 2; c < actionFields.length + 1; c++) {
            fillCellByAddress(wb, ws, sheetName, "", createObjectRowCol(rowCounter,c), subHeader, 'string');
        }

        for (let i = 1; i <= rowNumber; i++) {
            rowWidth.push({"hpx": 24});
            for (let k = 1; k <= actionFields.length; k++) {
                let data = Object.values(actionObj[itemTitle])[i-1][actionFields[k-1]];
                fillCellByAddress(wb, ws, sheetName, data, createObjectRowCol(rowCounter+i, k), row, 'string');
            }
        }
        rowCounter = rowCounter + rowNumber + 1;
    }

    setColsWidth(ws, rowHeight);
    setRowsHeight(ws, rowWidth);
    ws['!pageSetup'] = {scale: '90', orientation: 'landscape'};
}

const exportToExcel = () => {
    // excel file constructor global variables in /dist/excelWriter.js
    let wb = new Workbook();
    let wopts = setWopts();
    let proceed = !!document.querySelector('.responsive-element');
    let date = document.querySelector('.active-content .scorecard-title').innerText;
    let fileName = `ScoreCards Actions, ${date}.xlsx`;
    let actions = {};

    utilities.getNodes('.actions-container').forEach( (i) => {
        let action = i.id.replace('-', '');
        actions[action] = {};

        i.querySelectorAll('.responsive-header').forEach( (d) => {
            let title = d.querySelector('.action-title').innerText;
            actions[action][title] = {};

            d.querySelectorAll('.responsive-element').forEach( (c, f) => {
                let id = c.dataset.code;
                actions[action][title][f] = {};

                actions[action][title][f]['Id'] = id;
                actions[action][title][f]['Project'] = c.querySelector('.column-1').innerText;
                actions[action][title][f]['Country'] = c.querySelector('.column-2').innerText;
                actions[action][title][f]['Stage'] = c.querySelector('.column-3').innerText;
                actions[action][title][f]['Action'] = c.querySelector('.column-4').innerText;
                actions[action][title][f]['Status'] = c.querySelector('.column-5').innerText;
                actions[action][title][f]['Updates'] = c.querySelector('.column-6').innerText;
                actions[action][title][f]['Lead'] = c.querySelector('.column-7').innerText;
                actions[action][title][f]['Deadline'] = c.querySelector('.column-8').innerText;
            });
        });
    });

    if (proceed) {
        createExcelSheet(wb, actions["westaction"], "West-Africa");
        createExcelSheet(wb, actions["coastalaction"], "Coastal-Africa");
        createExcelSheet(wb, actions["centralaction"], "Central-Africa");

        saveFile(wb, wopts, fileName);
    }
};

const actionsListeners = () => {
    utilities.on('#scorecards-content', 'input', '.form-control.action-element', clearStyle);
    utilities.on('#scorecards-content', 'click', '.add-action', addAction);
    utilities.on('#scorecards-content', 'click', '.delete-action', removeAction);
    utilities.on('#scorecards-content', 'click', '.notify-action', sendNotification);
    utilities.on('#scorecards-content', 'click', '.actions-button', toggleAction);
    utilities.on('#scorecards-content', 'click', '#send-actions', sendActions);
};

export { actionsListeners, exportToExcel };