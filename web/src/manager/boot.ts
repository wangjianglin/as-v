import {
	Component,
    provide,
    Provider,
    Inject,
    APPLICATION_COMMON_PROVIDERS
} from '@angular/core';

import {CORE_DIRECTIVES, FORM_DIRECTIVES,
    LocationStrategy,
    HashLocationStrategy,
    Location} from '@angular/common'
import {bootstrap}    from '@angular/platform-browser-dynamic'
import {
    ROUTER_DIRECTIVES, 
    RouteConfig, 
    ROUTER_PROVIDERS,  
    Route, 
    AsyncRoute, 
    Router
} from '@angular/router-deprecated';

import {App} from './app';

import {LoggedInRouterOutlet} from './LoggedInOutlet';


import {Login} from './login';

// import {
//     Modal,IModalContentData,
//     ModalDialogInstance,
//     ModalConfig} from 'BootstrapModal';


// import {http} from 'lin'

//var lin = require('lin');
//lin = require('lin');

//import from 'lin';
//declare var lin:any;
//declare var $:any;

//import { NameList } from 'services/NameList';
//import {Dev} from './app/dev/dev';

declare var System:any;

// import { hello } from 'test1';
//     console.log(hello); // -> world


@Component({
    selector: 'boot',
    template:'<router-outlet></router-outlet>',
 //   viewProviders: [NameList],
 //   templateUrl: './app/app.html',
 //   styleUrls:['css/site.css'],
    directives: [LoggedInRouterOutlet]
})
@RouteConfig([
    { path: '/', name: 'root', redirectTo: ['App', 'Home'] },
    new Route({ path: '/app/...', component: App, name: 'App' }),
    new Route({ path: '/login', component: Login, name: 'Login' })
    // ,
    // new AsyncRoute({path: '/about', 
    //     loader: () => ComponentHelper.LoadComponentAsync('About','./app/about')
    //     , name: 'About'})
])
class Boot {
    // router: Router;
    // location: Location;

    constructor(router: Router, location: Location) {
    // constructor(router: Router) {
    // constructor(){
        //lin.http.commUrl = 'http://localhost:8000';
    //     debugger
        lin.http.commUrl = window.params.url || '';
    //     this.router = router;
    //     this.location = location;
    }


}


export function main(){
	// bootstrap(Boot);
    bootstrap(Boot, [
        ROUTER_PROVIDERS,
        //Modal 开始
        // provide(Modal,{useClass:Modal}),
        // provide(ModalDialogInstance,{useClass:ModalDialogInstance}),
        // provide(ModalConfig,{useClass:ModalConfig}),
        // provide(IModalContentData,{useClass:IModalContentData}),
        //Modal 结束
        provide(LocationStrategy, {useClass: HashLocationStrategy})
    ]);
}

