
import {Component, View} from '@angular/core';
// import {ModalDialogInstance, IModalContentData} from 'BootstrapModal';




@Component({
    selector: 'dev-edit',
    templateUrl: './manager/dev/dev-add.html'
 //   styleUrls:['./components/dev/dev-add.css'],
})
export class DevEdit {
    dialog: ModalDialogInstance;
    //context: AdditionCalculateWindowData;

    constructor(dialog: ModalDialogInstance, modelContentData: IModalContentData) {
        this.dialog = dialog;
        //this.context = <AdditionCalculateWindowData>modelContentData;
    }

    close() {
        this.dialog.close(23);
    }
}
export class DevAddWindowData implements IModalContentData{
    constructor(
        public num1: number,
        public num2: number
    ){}
}