import {
	Component,
    provide,
    Provider,
    Inject,
    AfterViewInit,
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

import {
    Modal,IModalContentData,
    ModalDialogInstance,
    ModalConfig} from 'BootstrapModal';

import {Home} from './home';

import {About} from './about'

import {LoggedInRouterOutlet} from './LoggedInOutlet';


//import {Login} from './login';

// import {http} from 'lin'

//var lin = require('lin');
//lin = require('lin');

//import from 'lin';
//declare var lin:any;
//declare var $:any;

//import { NameList } from 'services/NameList';
//import {Dev} from './dev/dev';

declare var System:any;

// import { hello } from 'test1';
//     console.log(hello); // -> world


@Component({
    selector: 'app',
 //   viewProviders: [NameList],
    templateUrl: './manager/app.html',
 //   styleUrls:['css/site.css'],
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    //new Route({path: '/', redirectTo: '/home',useAsDefault:true}),
    //d,
    //{path: '/', name: 'root', redirectTo: ['App','Home']},
    new Route({path: '/home', component: Home, name: 'Home'}),
//    new Route({path: '/login', component: Login, name: 'Login'}),
    new AsyncRoute({path: '/login', 
        loader: () => ComponentHelper.LoadComponentAsync('Dev','./manager/login')
        , name: 'Dev'}),
 //   new Route({path: '/dev/...', component: Dev, name: 'Dev'}),
    new AsyncRoute({path: '/dev/...', 
        loader: () => ComponentHelper.LoadComponentAsync('Dev','./manager/dev/dev')
        , name: 'Dev'}),
    new AsyncRoute({path: '/product', 
        loader: () => ComponentHelper.LoadComponentAsync('ProductList','./manager/product/product-list')
        , name: 'Product'})
    // ,
    // new AsyncRoute({path: '/about', 
    //     loader: () => ComponentHelper.LoadComponentAsync('About','./app/about')
    //     , name: 'About'})
])

export class App implements AfterViewInit {
    router: Router;
    location: Location;

    constructor(@Inject(Router)router: Router, @Inject(Location)location: Location) {
    //constructor(){
        lin.http.commUrl = window.params.url || '';
        this.router = router;
        this.location = location;
        
        this.year = new Date().getYear() + 1900);
    }

    ngAfterViewInit(){
        
        $('app').children('div').css('min-height',(window.innerHeight - $('footer').height() - $('header').height() - 20) + 'px');
  
    }

    getLinkStyle(path) {

        if(path === this.location.path()){
            return true;
        }
        else if(path.length > 0){
            return this.location.path().indexOf(path) > -1;
        }
    }
}


class ComponentHelper{

    static LoadComponentAsync(name:String,path:String){
        return System.import(path).then(c => c[name]);
    }
}

export function main(){
	//bootstrap(App);
    bootstrap(App, [
        ROUTER_PROVIDERS,
        //provide(Modal,{useClass:Modal}),
        //provide(ModalDialogInstance,{useClass:ModalDialogInstance}),
        //provide(ModalConfig,{useClass:ModalConfig}),
        //provide(IModalContentData,{useClass:IModalContentData}),
        provide(LocationStrategy, {useClass: HashLocationStrategy})
    ]);
}

