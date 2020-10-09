import Swal from 'sweetalert2/dist/sweetalert2.min.js';
import "sweetalert2/dist/sweetalert2.min.css";

const errorList = {
    dataNotFound: 'Data not found in SharePoint List',
    missingData: 'Please insert all the required information',
    sendNotification: 'Do you want to notify the Project Lead about this Action?',
    sendActions: 'Do you want to send a notification to all the Project Leads?'
};

const display = (data, callback, arg) => {
    Swal.fire(
        new ModalError(data)
    ).then( (result) => {
        if (result.value && callback) {
            return callback(arg);
        }
    });
};

class ModalError {
    constructor(data) {
        this.title = data.title;
        this.icon = data.icon;
        this.heightAuto = false;
        this.showCancelButton = data.confirm;
        this.confirmButtonColor = '#003870';
        this.confirmButtonText = 'Yes';
        this.html = `<div><p>${errorList[data.value]}</p></div>`;
    }
};

export { display };