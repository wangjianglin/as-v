
import {Component,OnInit,ElementRef,Inject,Injector,
    provide} from 'angular2/core';

import {NgFor,NgIf} from 'angular2/common'

import {RouteParams,
    RouteData,
    Router,
    Route,
    RouteConfig,
    ROUTER_DIRECTIVES,
    AsyncRoute} from 'angular2/router';


import {TreeView} from './tree-view';
import {Directory} from './directory';
//import {
//    Modal,
//    ModalDialogInstance,
//    ModalConfig,
//    YesNoModalContent,
//    YesNoModalContentData,
//    IModalContentData} from 'BootstrapModal';
//import {DevAddWindow,DevAddWindowData} from './dev-add'

//import {DevList} from './dev-list'

import {Empty} from 'ext';

@Component({
    selector: 'dev',
    directives:[ROUTER_DIRECTIVES,TreeView,NgFor,NgIf],
    templateUrl: './manager/dev/dev.html'
//    styleUrls:['./app/dev/dev.css'],
})
@RouteConfig([
    new Route({path: '/', component: Empty, name: 'Home'}),
    //{path: '/', redirectTo:['/Dev','DevList',{id:'3'}],name:'devroot'},
    new AsyncRoute({path: '/list/:id', 
        loader: () => ComponentHelper.LoadComponentAsync('DevList','./manager/dev/dev-list')
        , name: 'DevList'}),
    new AsyncRoute({path: '/edit/:id', 
        loader: () => ComponentHelper.LoadComponentAsync('DevEdit','./manager/dev/dev-edit')
        , name: 'DevEdit'}),
    new AsyncRoute({path: '/editClass/:id', 
        loader: () => ComponentHelper.LoadComponentAsync('Classes','./manager/dev/classes')
        , name: 'Classes'})
    // ,
    // new AsyncRoute({path: '/about', 
    //     loader: () => ComponentHelper.LoadComponentAsync('About','./app/about')
    //     , name: 'About'})
])
export class Dev implements OnInit{

	directories: Array<Directory>;
    name:string;
    elementRef: ElementRef;
    edit:Boolean = true;
    router:Router;

    //static modalData = {
     //   'customWindow': new AdditionCalculateWindowData(2, 3)
    //}; 
    //id: string;
    //constructor(params: RouteParams){
    //    this.id = params.get('id');
    //}

    constructor(@Inject(ElementRef) elementRef: ElementRef,@Inject(Router) router: Router){
        this.name = '==='
        this.elementRef = elementRef;
        this.router = router;
        this.loadDirectories();
    }

    addArticle(){
        console.log('==============')

        var component = DevAddWindow;
        //var containerInjector = this.injector.resolveAndCreateChild([
        //    bind(IModalContentData).toValue(new DevAddWindowData())
        //]);
        var rootRouter = this.router.parent;
        var nextInstruction = rootRouter._currentInstruction.component;
        var componentType = nextInstruction.componentType;
        var childRouter = rootRouter.childRouter(componentType);
        //var providers = Injector.resolve([provide(RouteData, {useValue: nextInstruction.routeData}),
        //    provide(RouteParams, {useValue: new RouteParams(nextInstruction.params)}),
        //    provide(Router, {useValue: childRouter})]);
        var providers = Injector.resolve([provide(RouteData, { useValue: nextInstruction.routeData }),
            provide(RouteParams, { useValue: new RouteParams(nextInstruction.params) }),
            provide(Router, { useValue: this.router })]);
        var config = new ModalConfig();
        config.closeText = "保存 ";
        config.title = '编辑文章';
        var dialog = this.modal.open(component, this.elementRef, providers, config);
        dialog.then(function (resultPromise) {
            return resultPromise.result.then(function (result) {
                //self.lastModalResult = result;
                console.log('============' + result);
            }, function () {
                console.log('*************');
                //self.lastModalResult = 'Rejected!'
            });
        });

        /*var component = DevAddWindow;

        var containerInjector = this.injector.resolveAndCreateChild([
            bind(IModalContentData).toValue(App.modalData[type])
        ]);


        var dialog = this.modal.open(component, elRef, containerInjector, new ModalConfig("lg"));
        dialog.then(function(resultPromise) {
            return resultPromise.result.then(function(result) {
                self.lastModalResult = result;
            }, function() {self.lastModalResult = 'Rejected!'});
        });*/
    }

    s(e){
        console.log(e);

        //debugger
        //console.log($(this.elementRef.nativeElement).find("#bb"))
        //$(this.elementRef.nativeElement).find("#bb").fadeOut(500);
    }

    editClass(e){
        console.log('--------');
        console.log(e)
        this.router.navigate( ['Dev','Classes', { id: e }] );
    }
    
    loadDirectories(){

        const mobile = new Directory({name:'移动开发',id:2},[],[{
            name:'Android',
            id:4
        },{
            name:'iOS',
            id:5
        },{
            name:'Hybrid App',
            id:7
        }]);

        const javas = new Directory({name:'Java后台',id:12},[],[{
            name:'Spring',
            id:23
        },{
            name:'JPA',
            id:43
        }]);

        this.directories = [mobile,javas];

        
        lin.http({
            url:'/services/dev/list.action',
            result:(e) => {
                console.log(e);
                this.name = 'okokok.'
            }
            });
    }
}


class ComponentHelper{

    static LoadComponentAsync(name:String,path:String){
        return System.import(path).then(c => c[name]);
    }
}