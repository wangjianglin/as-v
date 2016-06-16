import {Component} from '@angular/core';

// import {RouteParams} from '@angular/router';
import {ROUTER_DIRECTIVES} from '@angular/router';


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