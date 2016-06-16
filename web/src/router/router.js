"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require("angular2/core");
var browser_1 = require('angular2/platform/browser');
var router_1 = require("angular2/router");
//Music 组件
var Test1 = (function () {
    function Test1() {
    }
    Test1 = __decorate([
        core_1.Component({
            selector: "my-test1",
            template: "\n            <h1>=================</h1>\n        ",
            // templateUrl:'./router/test.html'
            styles: ["h1{background:#f00;}"]
        }), 
        __metadata('design:paramtypes', [])
    ], Test1);
    return Test1;
}());
//Music 组件
var Test = (function () {
    //    id: string;
    function Test(location, params) {
        console.log(params);
        //   constructor(location:Location){
    }
    Test = __decorate([
        core_1.Component({
            selector: "my-test",
            //template: `
            //       <h1>THAT''S FANTASTIC MUSIC!, RoutParams: {{id}}</h1>
            //   `,
            template: "\n     *************************<br>\n     <main>\n            <!--\u58F0\u660E\u8DEF\u7531\u51FA\u53E3-->\n            <router-outlet></router-outlet>\n        </main>\n        ",
            //     templateUrl:'./router/test.html'
            styles: ["h1{background:#f00;}"],
            directives: [router_1.ROUTER_DIRECTIVES]
        }),
        router_1.RouteConfig([
            { path: "/one", component: Test1, name: "One" },
        ]),
        __param(0, core_1.Inject(router_1.Location)),
        __param(1, core_1.Inject(router_1.RouteParams)), 
        __metadata('design:paramtypes', [(typeof (_a = typeof router_1.Location !== 'undefined' && router_1.Location) === 'function' && _a) || Object, (typeof (_b = typeof router_1.RouteParams !== 'undefined' && router_1.RouteParams) === 'function' && _b) || Object])
    ], Test);
    return Test;
    var _a, _b;
}());
// Video组件
var Video = (function () {
    function Video() {
    }
    Video = __decorate([
        core_1.Component({
            selector: "my-video",
            //template: `
            //       <h1>I LOVE THIS VIDEO!</h1>
            //   `,
            templateUrl: './router/video.html',
            styles: ["h1{background:#0f0;}"]
        }), 
        __metadata('design:paramtypes', [])
    ], Video);
    return Video;
}());
//Music 组件
var Music = (function () {
    function Music(params) {
        this.id = params.get('id');
        //debugger
    }
    Music = __decorate([
        core_1.Component({
            selector: "my-music",
            //template: `
            //       <h1>THAT''S FANTASTIC MUSIC!, RoutParams: {{id}}</h1>
            //   `,
            templateUrl: './router/music.html',
            styles: ["h1{background:#f00;}"]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof router_1.RouteParams !== 'undefined' && router_1.RouteParams) === 'function' && _a) || Object])
    ], Music);
    return Music;
    var _a;
}());
//App组件
var App = (function () {
    function App(location) {
        //location.go('/video');
    }
    App = __decorate([
        core_1.Component({
            selector: "my-app",
            directives: [router_1.ROUTER_DIRECTIVES],
            template: "\n        <!--\u58F0\u660E\u8DEF\u7531\u5165\u53E3-->\n        <nav>\n            <b [routerLink]=\"['/Video']\">video</b> | \n            <b [routerLink]=\"['/Test', {id:'3'},'One']\">videos</b> | \n            <b [routerLink]=\"['/Music', {id:'xx'}]\">music</b>\n        </nav>\n        <main>\n            <!--\u58F0\u660E\u8DEF\u7531\u51FA\u53E3-->\n            <router-outlet></router-outlet>\n        </main>\n        <my-test></my-test>\n    "
        }),
        router_1.RouteConfig([
            { path: "/music/:id", component: Music, name: "Music" },
            //])
            //@RouteConfig([
            { path: "/video", component: Video, name: "Video" },
            //{path: "/test/:id/...", component: Test, name: "Test" }
            new router_1.AsyncRoute({ path: '/test/...',
                loader: function () { return ComponentHelper.LoadComponentAsync('ProductList', './app/product/product-list'); },
                name: 'Test' })
        ]),
        __param(0, core_1.Inject(router_1.Location)), 
        __metadata('design:paramtypes', [(typeof (_a = typeof router_1.Location !== 'undefined' && router_1.Location) === 'function' && _a) || Object])
    ], App);
    return App;
    var _a;
}());
function main() {
    // bootstrap(MyDemoApp,[AddressBookTitleService,ROUTER_PROVIDERS, HTTP_PROVIDERS,
    //      provide(LocationStrategy, {useClass: HashLocationStrategy})]);
    browser_1.bootstrap(App, [
        router_1.ROUTER_PROVIDERS,
        core_1.provide(router_1.LocationStrategy, { useClass: router_1.HashLocationStrategy })
    ]);
}
exports.main = main;
var ComponentHelper = (function () {
    function ComponentHelper() {
    }
    ComponentHelper.LoadComponentAsync = function (name, path) {
        return System.import('./app/app').then(function (c) { return Test; });
    };
    return ComponentHelper;
}());
//# sourceMappingURL=router.js.map