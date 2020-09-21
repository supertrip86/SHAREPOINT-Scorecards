class ScoreCards {
    constructor(sharepointItem) {
		this.Title = sharepointItem.Title;
		this.Id = sharepointItem.Id;
		this.comment = sharepointItem.comment;
		this.motto = sharepointItem.motto;
		this.scoredate = sharepointItem.scoredate;
		this.wcadata = this.formatJSON(sharepointItem.wcadata);
		this.westdata = this.formatJSON(sharepointItem.westdata);
		this.coastaldata = this.formatJSON(sharepointItem.coastaldata);
		this.centraldata = this.formatJSON(sharepointItem.centraldata);
		this.westaction = this.formatJSON(sharepointItem.westaction);
		this.coastalaction = this.formatJSON(sharepointItem.coastalaction);
		this.centralaction = this.formatJSON(sharepointItem.centralaction);
    }

    formatJSON(item) {
        if (item) {
            return JSON.parse(item);

        } else {
            return null;

        }
    };
}

export { ScoreCards };