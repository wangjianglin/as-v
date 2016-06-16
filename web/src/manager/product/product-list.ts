import {Component} from '@angular/core';

import {RouteParams} from '@angular/router';
import {ROUTER_DIRECTIVES} from '@angular/router';


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