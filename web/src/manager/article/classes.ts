
import {Component, View,Inject} from 'angular2/core';
import {ModalDialogInstance, IModalContentData} from 'BootstrapModal';

import {RouteParams} from 'angular2/router'



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
