class SettingsItemSP {
    constructor(form, index) {
        this.Title = form.querySelector('.modal-edit-title').value.trim();
        this.Position = parseInt(index);
        this.Color = form.querySelector('.modal-edit-color').value.trim();
        this.Value1 = form.querySelector('.modal-edit-indicator1').value.trim();
        this.Target1 = parseInt(form.querySelector('.modal-edit-target1').value.trim());
        this.Range1 = form.querySelector('.modal-edit-time1').value.trim();
        this.Value2 = form.querySelector('.modal-edit-indicator2').value.trim();
        this.Target2 = parseInt(form.querySelector('.modal-edit-target2').value.trim());
        this.Range2 = form.querySelector('.modal-edit-time2').value.trim();
        this.__metadata = { type: app.storage.settingsType };
    }
}

export { SettingsItemSP };