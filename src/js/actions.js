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

    id && app.deletedActions.push(id);
    target.remove();
};

const sendNotification = (e) => {

    return display('sendNotification', true);
};

const sendActions = (e) => {
    const validateSend = document.querySelectorAll('.active-action .responsive-element').length > 0;

    validateSend && display('sendActions', true);
};

const actionsListeners = () => {
    utilities.on('#scorecards-content', 'input', '.form-control.action-element', clearStyle);
    utilities.on('#scorecards-content', 'click', '.add-action', addAction);
    utilities.on('#scorecards-content', 'click', '.delete-action', removeAction);
    utilities.on('#scorecards-content', 'click', '.notify-action', sendNotification);
    utilities.on('#scorecards-content', 'click', '.actions-button', toggleAction);
    utilities.on('#scorecards-content', 'click', '#send-actions', sendActions);
};

export { actionsListeners };