import {Component} from 'angular2/core';

import {RouteParams} from 'angular2/router';
import {ROUTER_DIRECTIVES} from 'angular2/router';


@Component({
    selector: 'home',
    directives:[ROUTER_DIRECTIVES],
    templateUrl: './manager/home.html'
})

export class Home {
    //id: string;
    //constructor(params: RouteParams){
    //    this.id = params.get('id');
    //}
}