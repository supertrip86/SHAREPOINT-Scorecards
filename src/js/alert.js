import Swal from 'sweetalert2/dist/sweetalert2.min.js';
import "sweetalert2/dist/sweetalert2.min.css";

const errorList = {
    dataNotFound: 'Data not found in SharePoint List',
    missingData: 'Please insert all the required information',
    sendNotification: 'Do you want to notify the Project Lead about this Action?',
    sendActions: 'Do you want to send a notification to all the Project Leads?'
};

const display = (value, confirm, callback, arg) => {
    Swal.fire(
        new ModalError(value, confirm)
    ).then( (result) => {
        if (result.value && callback) {
            return callback(arg);
        }
    });
};

class ModalError {
    constructor(value, confirm) {
        this.title = confirm ? 'Wait' : 'Warning';
        this.icon = confirm ? 'question' : 'warning';
        this.heightAuto = false;
        this.showCancelButton = confirm ? true : false;
        this.confirmButtonColor = '#003870';
        this.confirmButtonText = 'Yes';
        this.html = `<div><p>${errorList[value]}</p></div>`;
    }
};

export { display };