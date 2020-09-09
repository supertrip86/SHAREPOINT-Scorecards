import utilities from "./utilities";

class App {
    constructor(data) {
        this.settings = data.settings;
        this.scorecards = data.scorecards;
        this.storage = this.createStorage(data);
    }

    createStorage(data) {
        return {
            settingsList: data.settingsList,
            settingsType: data.settings[0].__metadata.type,
            settingsURL: data.settingsData,
            scorecardsList: data.scorecardsList,
            scorecardsType: data.scorecardsType,
            scorecardsURL: data.scorecardsData
        };
    }
};

class Admin extends App {
    constructor(data) {
        super(data);
    }
};

const limitIndicatorValues = (e) => {
    if (((e.charCode < 46 || e.charCode > 57) || e.charCode === 47) || (e.charCode === 46 && e.target.value.indexOf('.') !== -1)) {
        e.preventDefault();
    }
};

const toggleDashboard = (e) => {
    if (e.target.classList.contains('toggle-dashboard-off')) {
        e.target.classList.remove('toggle-dashboard-off');
        e.target.classList.add('toggle-dashboard-on');
        e.target.closest('.comment-wrapper').querySelector('.ql-toolbar').classList.remove('vanish');

    } else {
        e.target.classList.remove('toggle-dashboard-on');
        e.target.classList.add('toggle-dashboard-off');
        e.target.closest('.comment-wrapper').querySelector('.ql-toolbar').classList.add('vanish');
    }
};

const closeLikelihood = (e) => {
    if (!e.target.closest('.scorecard-indicator-likelihood')) {
        utilities.getNodes('.scorecard-likelihood-selection').forEach( (i) => {
            if (i.classList.contains('active')) {
                utilities.getNodes('.scorecard-likelihood-option', i.parentElement).forEach( (i) => i.classList.add('vanish') );
                i.classList.remove('active');
            }
        });
    }
};

const expandLikelihood = (e) => {
    const target = e.target.classList.contains('scorecard-likelihood-selection') ? e.target : e.target.parentElement;

    if (target.classList.contains('active')) {
        utilities.getNodes('.scorecard-likelihood-option', target.parentElement).forEach( (i) => i.classList.add('vanish') );
        target.classList.remove('active');

    } else {
        utilities.getNodes('.scorecard-likelihood-option', target.parentElement).forEach( (i) => i.classList.remove('vanish') );
        target.classList.add('active');
    }
};

const selectLikelihood = (e) => {
    const target = e.target;
    const selection = target.classList.contains('scorecard-likelihood-option') ? target.querySelector('.line') : target;
    const newSelection = (selection.classList.length > 2) ? `${selection.className.replace('select-likelihood ', '')} open-likelihood-dropdown` : `line open-likelihood-dropdown`;

    target.closest('.scorecard-indicator-likelihood').querySelector('.scorecard-likelihood-selection .line').className = newSelection;
    target.closest('ul').querySelector('.scorecard-likelihood-selection').classList.remove('active');
    utilities.getNodes('.scorecard-likelihood-option', target.closest('ul')).forEach( (i) => i.classList.add('vanish') );
};

const scorecardsListeners = () => {
    document.addEventListener('click', closeLikelihood);

    utilities.on('#wca-content', 'paste', '.input-number', utilities.preventDefault);
    utilities.on('#wca-content', 'keypress', '.input-number', limitIndicatorValues);
    utilities.on('#wca-content', 'click', '.toggle-dashboard', toggleDashboard);
    utilities.on('#wca-content', 'click', '.open-likelihood-dropdown', expandLikelihood);
    utilities.on('#wca-content', 'click', '.select-likelihood', selectLikelihood);
};

export { App, Admin, scorecardsListeners }