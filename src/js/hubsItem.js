class HubsItem {
    constructor(item) {
        this.Title = item.Title;
        this.motto = item.motto;
        this.management = app.management;
        this.data = this.getData(item);
    }

    getData(item) {
        let data = {};

        Object.keys(item.wcadata).forEach( (i) => {
            data[i] = {};
            data[i]["wca"] = item.wcadata[i];
            data[i]["west"] = item.westdata ? item.westdata[i] : {};
            data[i]["coastal"] = item.coastaldata ? item.coastaldata[i] : {};
            data[i]["central"] = item.centraldata ? item.centraldata[i] : {};
        });

        return data;
    }
}

export { HubsItem };