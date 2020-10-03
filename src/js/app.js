class App {
    constructor(data) {
        this.settings = data.settings;
        this.scorecards = data.scorecards;
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
            scorecardsURL: data.scorecardsData
        };
    }
};

class Admin extends App {
    constructor(data) {
        super(data);

        this.admin = true;
        this.users = data.usersList;
    }
};

export { App, Admin };