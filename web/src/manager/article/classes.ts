
import {Component, Inject} from '@angular/core';
// import {ModalDialogInstance, IModalContentData} from 'BootstrapModal';

import {RouteParams} from '@angular/router-deprecated'



@Component({
    selector: 'dev-classes',
    templateUrl: './manager/dev/classes.html'
 //   styleUrls:['./components/dev/dev-add.css'],
})
export class Classes {
    
    //context: AdditionCalculateWindowData;

    constructor(@Inject(RouteParams) params:RouteParams) {
        //this.dialog = dialog;
        //this.context = <AdditionCalculateWindowData>modelContentData;
    }

}
