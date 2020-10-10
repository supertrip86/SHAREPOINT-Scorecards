class App {
    constructor(data) {
        this.settings = data.settings;
        this.scorecards = data.scorecards;
        this.management = data.management;
        this.storage = this.createStorage(data);
    }

    createStorage(data) {
        return {
            site: data.site,
            settingsList: data.settingsList,
            settingsType: data.settings[0].__metadata.type,
            settingsURL: data.settingsData,
            scorecardsList: data.scorecardsList,
            scorecardsType: data.scorecardsType,
            scorecardsURL: data.scorecardsData,
            managementList: data.managementList
        };
    }
};

class Admin extends App {
    constructor(data) {
        super(data);

        this.admin = true;
        this.owner = data.isOwner;
        this.person = data.person;
        this.users = data.usersList;
        this.deletedActions = [];
    }
};

export { App, Admin };