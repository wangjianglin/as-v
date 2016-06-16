
import {Component,OnInit,ElementRef,Inject,Injector,
    provide} from '@angular/core';

import {NgFor, NgIf} from '@angular/common'

import {RouteParams,
    RouteData,
    Router,
    Route,
    RouteConfig,
    ROUTER_DIRECTIVES,
    AsyncRoute} from '@angular/router-deprecated';

import {loadComponentAsync} from 'ext'

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
    templateUrl: './manager/article/clsdir.html'
//    styleUrls:['./app/dev/dev.css'],
})
@RouteConfig([
    new Route({path: '/', component: Empty, name: 'Home'}),
    //{path: '/', redirectTo:['/Dev','DevList',{id:'3'}],name:'devroot'},
    new AsyncRoute({path: '/list/:id', 
        loader: () => loadComponentAsync('List','./manager/article/list')
        , name: 'List'}),
    new AsyncRoute({path: '/edit/:cid/:id', 
        loader: () => loadComponentAsync('Edit','./manager/article/edit')
        , name: 'Edit'}),
    new AsyncRoute({path: '/editClass/:id', 
        loader: () => loadComponentAsync('Classes','./manager/article/classes')
        , name: 'Classes'})
    // ,
    // new AsyncRoute({path: '/about', 
    //     loader: () => ComponentHelper.LoadComponentAsync('About','./app/about')
    //     , name: 'About'})
])
export class ClsDir implements OnInit{

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
        @Inject(Router) router: Router,
        @Inject(RouteParams) params:RouteParams){
        this.name = '==='
        this.elementRef = elementRef;
        this.router = router;
        this.params = params;

        console.log(this.params)
        console.log(elementRef);
        // httpRequest();

    //     var dataConfig = new YesNoModalContentData('Simple Large modal', 'Press ESC or click OK / outside area to close.', true);

    // var dialog = this.modal.open(component, elRef, containerInjector, new ModalConfig("lg"));
    //     dialog.then(function(resultPromise) {
    //         return resultPromise.result.then(function(result) {
    //             self.lastModalResult = result;
    //         }, function() {self.lastModalResult = 'Rejected!'});
    //     });
        this.loadDirectories();
    }


    s(e){
        //console.log(e);

        //debugger
        //console.log($(this.elementRef.nativeElement).find("#bb"))
        //$(this.elementRef.nativeElement).find("#bb").fadeOut(500);
        this.router.navigate( ['ArticleList', { cid: e }] );
    }

    editClass(e){
        console.log('--------');
        console.log(e)
        this.router.navigate( ['ArticleList', { id: e }] );
    }
    
    loadDirectories(){

        setTimeout(()=>{

            lin.http.communicate({
                url:'/article/list.action',
                params:{
                    id:this.params.params.id
                },
                result:(e) => {

                    var openFun = function(parent,items,id){
                        if(!items){
                            return;
                        }
                        for(var n=0;n<items.length;n++){
                            if(items[n].id == id){
                                items[n].open = true;
                                parent.open = true;
                            }
                            if(!items[n].items || items[n].items.length == 0){
                                // items[n].target = '_self';
                                // if(items[n].type == 2){
                                //     items[n].url = '/article{{obj.id}}/clsdir/list'+items[n].id + '.html';
                                // }else{
                                //     items[n].url = '/article{{obj.id}}/clsdir/list'+items[n].id + '/content.html';
                                // }
                            }
                            openFun(items[n],items[n].items,id);
                        }
                    }
                    // console.log(json)
                    openFun(undefined,e,0);

                    var setting = {
                        data:{
                            key:{
                                children: "items",
                                name:'title'
                            }
                        },
                        view: {
                            dblClickExpand: true,
                            showLine: false,
                            selectedMulti: false,
                            showIcon:false
                        },
                        callback: {
                            // onClick: function(event, treeId, treeNode) {
                            //     //window.location.href = '/article{{obj.id}}/clsdir/list'+treeNode.id + '.html';
                            // }
                            onClick:(event,treeId,treeNode)=>{
                                if(treeNode.type == 2){
                                    this.router.navigate( ['./List', { id: treeNode.id }] );
                                }else if(treeNode.type == 3){
                                    this.router.navigate( ['./Edit', { cid: treeNode.id,id:0,isContent:true }] );
                                }
                            }
                        }
                    };
                    // $(document).ready(function(){
                    var t = $.fn.zTree.init($("#article-class-tree"), setting, e);

                    // if(!e){
                    //     this.directories = [];
                    // }

                    // var ds = [];

                    // //var id = 0;
                    // for(var n=0;n<e.length;n++){
                    //     if(e[n].items){
                    //         for(var m=0;m<e[n].items.length;m++){
                    //             e[n].items[m].name = e[n].items[m].title;
                    //         }
                    //     }
                    //     ds.push(new Directory({name:e[n].title,id:e[n].id},[],e[n].items));
                    // }
                    // this.directories = ds;

                    //if(e.length > 0 && !this.router.loaded){
                        // this.router.navigate( ['List', { id: e[0].items[0].id }] );
                    //}
                }
            });
        },0);

    }
}


