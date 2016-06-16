import {Component, ElementRef, Inject, Directive, ViewContainerRef, TemplateRef} from '@angular/core';

import {RouteParams} from '@angular/router-deprecated';
import {ROUTER_DIRECTIVES} from '@angular/router';


//@Component({
 //   selector: 'about',
//    directives:[ROUTER_DIRECTIVES]
//    ,
//    templateUrl: './app/about.html'
//})

@Directive({
	selector: 'about'
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