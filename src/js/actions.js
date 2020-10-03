import ActionsElement from "../hbs/partials/actionsElement.hbs";
import SelectPure from "select-pure";
import utilities from "./utilities";

const toggleAction = (e) => {
    const hash = location.hash.split('-');
    const view = e.target.id.split('-')[0];

    location.hash = `${view}-${hash[1]}-${hash[2]}`;
};

const addAction = (e) => {
    const target = e.target.parentElement;
    const container = target.querySelector('.action-elements');
    const max = parseInt(target.dataset.max) + 1;
    
    target.dataset.max = max;
    container.insertAdjacentHTML( 'beforeend', ActionsElement(max) );

    // new SelectPure(container.querySelector('.responsive-element:last-child'), incomeOptions);

    // return {
	// 	options: list,
	// 	placeholder: placeholder,
	// 	autocomplete: auto,
	// 	multiple: multiple,
	// 	value: value,
	// 	icon: "remove-country",
	// 	onChange: () => getNodeList('.select-pure__select').forEach( (i) => i.style = "" )
	// };
};

const removeAction = (e) => {
    e.target.parentElement.remove();
};

const sendNotification = (e) => {
    console.log(e.target.parentElement);
};

const sendActions = (e) => {
    console.log(e.target);
};

const actionsListeners = () => {
    utilities.on('#scorecards-content', 'click', '.add-action', addAction);
    utilities.on('#scorecards-content', 'click', '.delete-action', removeAction);
    utilities.on('#scorecards-content', 'click', '.notify-action', sendNotification);
    utilities.on('#scorecards-content', 'click', '.actions-button', toggleAction);
    utilities.on('#scorecards-content', 'click', '#send-actions', sendActions);
};

export { actionsListeners };