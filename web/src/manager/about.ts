import {Component,ElementRef,Inject,Directive,ViewContainerRef,TemplateRef} from 'angular2/core';

import {RouteParams} from 'angular2/router';
import {ROUTER_DIRECTIVES} from 'angular2/router';


//@Component({
 //   selector: 'about',
//    directives:[ROUTER_DIRECTIVES]
//    ,
//    templateUrl: './app/about.html'
//})

@Directive({
	selector: 'about',
    directives:[ROUTER_DIRECTIVES]
	})

export class About {
    //id: string;
    viewContainer: ViewContainerRef;
  // templateRef: TemplateRef;

    constructor(@Inject(ElementRef) elementRef: ElementRef,viewContainer: ViewContainerRef){
        
        //debugger

 this.viewContainer = viewContainer;
    // this.templateRef = templateRef;
    }

    click(){
    	console.log('===');
    }
}