import "../css/settings.css";
import Modal from "../hbs/settings.hbs";
import Settings from "../hbs/partials/settingsComponents.hbs";
import $ from "jquery";
import { receiveData, modifySettings } from "../js/requests.js";
import utilities from "./utilities.js";

const switchCard = (e) => {
    const menuItem = e.target;
    const dialogForm = document.querySelector(`.dialog-form-item[data-id="${menuItem.dataset.id}"]`);

    utilities.getNodes('.dialog-menu-item').forEach( (i) => i.classList.remove('active') );
    utilities.getNodes('.dialog-form-item').forEach( (i) => i.classList.add('vanish') );

    dialogForm.classList.remove('vanish');
    menuItem.classList.add('active');
};

const resetSettings = () => {
    document.querySelector('.modal-body').innerHTML = "";
};

const callSettings = () => {
    receiveData(app.storage.settingsURL).then( (result) => {
        const settings = result.d.results;

        document.querySelector('.modal-body').innerHTML = Settings(settings);
        document.querySelector('.dialog-menu-item').click();
    });
};

const updateTitle = (e) => {
    const id = e.target.closest('.dialog-form-item').dataset.id;
    const target = document.querySelector(`.dialog-menu-item[data-id="${id}"]`);

    target.innerText = e.target.value;
};

const modalListeners = () => {
    $('#settingsMenu').on('show.bs.modal', callSettings);
    $('#settingsMenu').on('hidden.bs.modal', resetSettings);

    utilities.on('#scorecards-dialog', 'paste', '.input-number', utilities.preventDefault);
    utilities.on('#scorecards-dialog', 'keypress', '.input-number', utilities.limitIndicatorValues);
    utilities.on('#scorecards-dialog', 'input', '.modal-edit-title', updateTitle);
    utilities.on('#scorecards-dialog', 'click', '.dialog-menu-item', switchCard);
    utilities.on('#scorecards-dialog', 'click', '#save-settings', modifySettings);
};

export { Modal, modalListeners };