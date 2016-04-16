
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

import {loadComponentAsync} 'ext'

import {TreeView} from './tree-view';
import {Directory} from './directory';
// import {
//    Modal,
//    ModalDialogInstance,
//    ModalConfig,
//    YesNoModalContent,
//    YesNoModalContentData,
//    IModalContentData} from 'BootstrapModal';
//import {DevAddWindow,DevAddWindowData} from './dev-add'

//import {DevList} from './dev-list'

declare var lin:any;

import {Empty} from 'ext';



// @Component({})
// export class Home {
    
//     constructor(@Inject(RouteParams) params:RouteParams,@Inject(Router) router: Router) {
//         //this.context = <AdditionCalculateWindowData>modelContentData;
//         //console.log(params.params)
        
//     }

// }

@Component({
    selector: 'clsdir',
    directives:[ROUTER_DIRECTIVES,TreeView,NgFor,NgIf],
    // template:''
    // ,
    template:'<router-outlet></router-outlet>'
//    styleUrls:['./app/dev/dev.css'],
})
@RouteConfig([
    new Route({path: '/', component: Empty, name: 'Home'}),
    //{path: '/', redirectTo:['/Dev','DevList',{id:'3'}],name:'devroot'},
    new AsyncRoute({path: '/list/:id', 
        loader: () => loadComponentAsync('List','./manager/article/list')
        , name: 'List'}),
    new AsyncRoute({path: '/edit/:id', 
        loader: () => loadComponentAsync('Edit','./manager/article/edit')
        , name: 'Edit'})
    // ,
    // new AsyncRoute({path: '/about', 
    //     loader: () => ComponentHelper.LoadComponentAsync('About','./app/about')
    //     , name: 'About'})
])
export class Cls implements OnInit{

	directories: Array<Directory>;
    name:string;
    elementRef: ElementRef;
    edit:Boolean = true;
    router:Router;
    params:RouteParams;

    //static modalData = {
     //   'customWindow': new AdditionCalculateWindowData(2, 3)
    //}; 
    //id: string;
    //constructor(params: RouteParams){
    //    this.id = params.get('id');
    //}

    constructor(@Inject(ElementRef) elementRef: ElementRef,
        @Inject(Router) router: Router
        @Inject(RouteParams) params:RouteParams){
        this.name = '==='
        this.elementRef = elementRef;
        this.router = router;
        this.params = params;

        console.log(this.params)
        // httpRequest();

    //     var dataConfig = new YesNoModalContentData('Simple Large modal', 'Press ESC or click OK / outside area to close.', true);

    // var dialog = this.modal.open(component, elRef, containerInjector, new ModalConfig("lg"));
    //     dialog.then(function(resultPromise) {
    //         return resultPromise.result.then(function(result) {
    //             self.lastModalResult = result;
    //         }, function() {self.lastModalResult = 'Rejected!'});
    //     });
        //this.loadDirectories();
        this.router.navigate( ['List', { id: this.params.params.id }] );
    }


    s(e){
        //console.log(e);

        //debugger
        //console.log($(this.elementRef.nativeElement).find("#bb"))
        //$(this.elementRef.nativeElement).find("#bb").fadeOut(500);
        this.router.navigate( ['ArticleList', { id: e }] );
    }

    editClass(e){
        console.log('--------');
        console.log(e)
        this.router.navigate( ['ArticleList', { id: e }] );
    }
    
    loadDirectories(){
/*
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
*/

        setTimeout(()=>{

            lin.http.communicate({
                url:'/article/list.action',
                params:{
                    id:this.params.params.id
                },
                result:(e) => {

                    if(!e){
                        this.directories = [];
                    }

                    var ds = [];

                    //var id = 0;
                    for(var n=0;n<e.length;n++){
                        if(e[n].items){
                            for(var m=0;m<e[n].items.length;m++){
                                e[n].items[m].name = e[n].items[m].title;
                            }
                        }
                        ds.push(new Directory({name:e[n].title,id:e[n].id},[],e[n].items));
                    }
                    this.directories = ds;

                    //if(e.length > 0 && !this.router.loaded){
                        this.router.navigate( ['List', { id: e[0].id }] );
                    //}
                }
            });
        },0);

    }
}


