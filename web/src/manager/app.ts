import {
	Component,
    provide,
    Provider,
    Inject,
    AfterViewInit,
    APPLICATION_COMMON_PROVIDERS
} from '@angular/core';

import {CORE_DIRECTIVES,FORM_DIRECTIVES,
    Location,
    LocationStrategy,
    HashLocationStrategy} from '@angular/common'
import {bootstrap}    from '@angular/platform-browser-dynamic'
import {
    ROUTER_DIRECTIVES, 
    RouteConfig,
    ROUTER_PROVIDERS, 
    Route, 
    AsyncRoute, 
    Router
} from '@angular/router-deprecated';

import {loadComponentAsync} from 'ext'

// import {
//     Modal,IModalContentData,
//     ModalDialogInstance,
//     ModalConfig} from 'BootstrapModal';

import {Home} from './home';

import {About} from './about'

import {LoggedInRouterOutlet} from './LoggedInOutlet';



declare var System:any;


@Component({
    selector: 'app',
    templateUrl: './manager/app.html',
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
        new Route({ path: '/home', component: Home, name: 'Home', useAsDefault: true}),
    new AsyncRoute({path: '/article/:id/:type/...', 
        loader: () => loadComponentAsync('Article','./manager/article/article')
        , name: 'Article'}),
    new AsyncRoute({path: '/product', 
        loader: () => loadComponentAsync('ProductList','./manager/product/product-list')
        , name: 'Product'})
])
export class App implements AfterViewInit {
    router: Router;
    location: Location;

    datas:any

    constructor(@Inject(Router)router: Router, @Inject(Location)location: Location) {
    //constructor(){
        
        this.router = router;
        this.location = location;
        
        this.year = new Date().getYear() + 1900;
        // this.datas = [{id:3,name:"开发技术"},
        //     {id:4,name:"产品"},
        //     {id:5,name:"算法"},
        //     {id:6,name:"设计"},
        //     {id:7,name:"文档(docbook/latex)"},
        //     {id:8,name:"其他"}
        //     ];
        setTimeout(()=>{
            lin.http.communicate({
                url:'/article/navs.action',
                result:(e) => {
                    if(e){
                        for(var n=0;n<e.length;n++){
                            if(e[n].type == 0){
                                e[n]._route = 'Article'
                            }
                        }
                    }
                    this.datas = e;
                    // var ds = [];

                    // for(var n=0;n<e.length;n++){
                    //     for(var m=0;m<e[n].items.length;m++){
                    //         e[n].items[m].name = e[n].items[m].title;
                    //     }
                    //     ds.push(new Directory({name:e[n].title,id:e[n].id},[],e[n].items));
                    // }
                    // this.directories = ds;

                    // if(e.length > 0 && !this.router.loaded){
                    //     this.router.navigate( ['ArticleList', { id: e[0].id }] );
                    // }
                }
            });
        },0);
    }

    ngAfterViewInit(){
        
        $('app').children('div').css('min-height',(window.innerHeight - $('footer').height() - $('header').height() - 21) + 'px');
        $('body').css('overflow', '');
        
        $(window).on('resize', function() {
            $('app').children('div').css('min-height', (window.innerHeight - $('header').height() - $('footer').height() - 20) + 'px');
        })
    }

    getLinkStyle(path,id) {

        path += id;
        if(path === this.location.path()){
            return true;
        }
        else if(path.length > 0){
            return this.location.path().indexOf(path + '/') > -1;
        }
    }

    logout(){
        this.router.navigate(['../Login']);
    }
}
