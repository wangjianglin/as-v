import {
	Component,
    provide,
    Provider,
    Inject,
    APPLICATION_COMMON_PROVIDERS
} from 'angular2/core';

import {CORE_DIRECTIVES,FORM_DIRECTIVES} from 'angular2/common'
import {bootstrap}    from 'angular2/platform/browser'
import {
    ROUTER_DIRECTIVES, 
    RouteConfig, 
    Location,
    ROUTER_PROVIDERS, 
    LocationStrategy, 
    HashLocationStrategy, 
    Route, 
    AsyncRoute, 
    Router
} from 'angular2/router';

import {App} from './app';

import {LoggedInRouterOutlet} from './LoggedInOutlet';


import {Login} from './login';

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
    directives: [ROUTER_DIRECTIVES,LoggedInRouterOutlet]
})
@RouteConfig([
    {path: '/', name: 'root', redirectTo: ['App','Home']},
    new Route({path: '/app/...', component: App, name: 'App'}),
    new Route({path: '/login', component: Login, name: 'Login'})
    // ,
    // new AsyncRoute({path: '/about', 
    //     loader: () => ComponentHelper.LoadComponentAsync('About','./app/about')
    //     , name: 'About'})
])

class Boot {
    router: Router;
    location: Location;

    constructor(@Inject(Router)router: Router, @Inject(Location)location: Location) {
    //constructor(){
        lin.http.commUrl = 'http://localhost:8000';
        this.router = router;
        this.location = location;
    }


}


export function main(){
	//bootstrap(App);
    bootstrap(Boot, [
        ROUTER_PROVIDERS,
        //provide(Modal,{useClass:Modal}),
        //provide(ModalDialogInstance,{useClass:ModalDialogInstance}),
        //provide(ModalConfig,{useClass:ModalConfig}),
        //provide(IModalContentData,{useClass:IModalContentData}),
        provide(LocationStrategy, {useClass: HashLocationStrategy})
    ]);
}

