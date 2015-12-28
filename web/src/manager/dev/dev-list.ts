
import {Component, View} from 'angular2/core';





@Component({
    selector: 'dev-list'
})
@View({
    templateUrl: './manager/dev/dev-list.html'
})
export class DevList {
    //context: AdditionCalculateWindowData;

    constructor() {
        //this.context = <AdditionCalculateWindowData>modelContentData;
    }

    close() {
    }
}
