class HubsItem {
    constructor(item) {
        this.Title = item.Title;
        this.motto = item.motto;
        this.data = this.getData(item);
    }

    getData(item) {
        let data = {};

        Object.keys(item.wcadata).forEach( (i) => {
            data[i] = {};
            data[i]["wca"] = item.wcadata[i];

            item.westdata && (data[i]["west"] = item.westdata[i]);
            item.coastaldata && (data[i]["coastal"] = item.coastaldata[i]);
            item.centraldata && (data[i]["central"] = item.centraldata[i]);
        });

        return data;
    }
}

export { HubsItem };