import {Component} from 'angular2/core';

import {RouteParams} from 'angular2/router';
import {ROUTER_DIRECTIVES} from 'angular2/router';


@Component({
    selector: 'product-list',
    directives:[ROUTER_DIRECTIVES],
    templateUrl: './manager/product/product-list.html'
})

export class ProductList {
    //id: string;
    //constructor(params: RouteParams){
    //    this.id = params.get('id');
    //}
}