import { Component, provide,Inject} from "angular2/core";
import {bootstrap}    from 'angular2/platform/browser'
import {
    ROUTER_DIRECTIVES, 
    ROUTER_PROVIDERS, 
    RouteConfig, 
    RouteParams,
    Location,
    LocationStrategy, 
    HashLocationStrategy,
    ROUTER_PRIMARY_COMPONENT,
    AsyncRoute
} from "angular2/router";

declare var System:any;

//Music 组件
@Component({ 
    selector: "my-test1",
    template: `
            <h1>=================</h1>
        `,
    // templateUrl:'./router/test.html'
    styles: [`h1{background:#f00;}`]
})
class Test1 {
 //   id: string;
  //  constructor(params:RouteParams){
   // }
 }

//Music 组件
@Component({ 
    selector: "my-test",
    //template: `
     //       <h1>THAT''S FANTASTIC MUSIC!, RoutParams: {{id}}</h1>
     //   `,
     template:`
     *************************<br>
     <main>
            <!--声明路由出口-->
            <router-outlet></router-outlet>
        </main>
        `,
//     templateUrl:'./router/test.html'
    styles: [`h1{background:#f00;}`],
    directives:[ROUTER_DIRECTIVES]
})
@RouteConfig([
    {path: "/one", component: Test1, name: "One" },
])
class Test {
//    id: string;
    constructor(@Inject(Location) location:Location,@Inject(RouteParams) params:RouteParams){
        console.log(params);
 //   constructor(location:Location){
    }
 }

// Video组件
@Component({ 
    selector: "my-video",
    //template: `
     //       <h1>I LOVE THIS VIDEO!</h1>
     //   `,
templateUrl:'./router/video.html',
    styles: [`h1{background:#0f0;}`]
})

class Video { }
        
//Music 组件
@Component({ 
    selector: "my-music",
    //template: `
     //       <h1>THAT''S FANTASTIC MUSIC!, RoutParams: {{id}}</h1>
     //   `,
     templateUrl:'./router/music.html',
    styles: [`h1{background:#f00;}`]
})

class Music {
    id: string;
    constructor(params:RouteParams){
        this.id = params.get('id');
        //debugger
    }
 }
    
//App组件
@Component({ 
    selector: "my-app",
    directives: [ROUTER_DIRECTIVES],
    template : `
        <!--声明路由入口-->
        <nav>
            <b [routerLink]="['/Video']">video</b> | 
            <b [routerLink]="['/Test', {id:'3'},'One']">videos</b> | 
            <b [routerLink]="['/Music', {id:'xx'}]">music</b>
        </nav>
        <main>
            <!--声明路由出口-->
            <router-outlet></router-outlet>
        </main>
        <my-test></my-test>
    `

})
//路由配置注解
@RouteConfig([
    
    {path:"/music/:id", component:Music, name:"Music"},
//])
//@RouteConfig([
    {path: "/video", component: Video, name: "Video" },
    //{path: "/test/:id/...", component: Test, name: "Test" }
    new AsyncRoute({path: '/test/...', 
        loader: () => ComponentHelper.LoadComponentAsync('ProductList','./app/product/product-list')
        , name: 'Test'})

])
class App{ 
    constructor(@Inject(Location) location: Location) {
        //location.go('/video');
    }     
}
    
         
export function main(){
   // bootstrap(MyDemoApp,[AddressBookTitleService,ROUTER_PROVIDERS, HTTP_PROVIDERS,
    //      provide(LocationStrategy, {useClass: HashLocationStrategy})]);
    bootstrap(App, [
        ROUTER_PROVIDERS,
        provide(LocationStrategy, {useClass: HashLocationStrategy})
    ]);
}


class ComponentHelper{

    static LoadComponentAsync(name:String,path:String){
        return System.import('./app/app').then(c => Test);
    }
}