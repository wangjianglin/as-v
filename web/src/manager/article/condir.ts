
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
    selector: 'condir',
    directives:[ROUTER_DIRECTIVES,TreeView,NgFor,NgIf],
    // template:''
    // ,
    templateUrl: './manager/article/condir.html'
//    styleUrls:['./app/dev/dev.css'],
})
@RouteConfig([
    new Route({path: '/', component: Empty, name: 'Home'}),
    new AsyncRoute({path: '/edit/:id', 
        loader: () => loadComponentAsync('Edit','./manager/article/edit')
        , name: 'Edit'})    // ,
    // new AsyncRoute({path: '/about', 
    //     loader: () => ComponentHelper.LoadComponentAsync('About','./app/about')
    //     , name: 'About'})
])
export class ConDir implements OnInit{

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

        // console.log(this.params)
        // console.log(this.elementRef.nativeElement);
        // console.log($(elementRef.nativeElement).find('#article-class-tree'));
        
        // httpRequest();

    //     var dataConfig = new YesNoModalContentData('Simple Large modal', 'Press ESC or click OK / outside area to close.', true);

    // var dialog = this.modal.open(component, elRef, containerInjector, new ModalConfig("lg"));
    //     dialog.then(function(resultPromise) {
    //         return resultPromise.result.then(function(result) {
    //             self.lastModalResult = result;
    //         }, function() {self.lastModalResult = 'Rejected!'});
    //     });
        //this.loadDirectories();
    }

    ngOnInit(){ 
        // console.log(this.elementRef.nativeElement);
        // console.log($(this.elementRef.nativeElement).find('#article-class-tree'));
        this.loadDirectories();
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
    
    newCount = 1;
    add(e) {
        var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
        isParent = e.data.isParent,
        nodes = zTree.getSelectedNodes(),
        treeNode = nodes[0];
        if (treeNode) {
            treeNode = zTree.addNodes(treeNode, {id:(100 + this.newCount), pId:treeNode.id, isParent:isParent, name:"new node" + (newCount++)});
        } else {
            treeNode = zTree.addNodes(null, {id:(100 + this.newCount), pId:0, isParent:isParent, name:"new node" + (newCount++)});
        }
        if (treeNode) {
            zTree.editName(treeNode[0]);
        } else {
            alert("叶子节点被锁定，无法增加子节点");
        }
    };

    addContent(){
        console.log('********')
    }
    addSubDirClick(){
        this.addSubDir();
    }
    addSubDir(parent,node) {
        console.log('=====')
        if(!this.tree){
            return;
        }
        // var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
        //     isParent = e.data.isParent,
        //     nodes = zTree.getSelectedNodes(),
        //     treeNode = nodes[0];
        // if (treeNode) {
        //     treeNode = zTree.addNodes(treeNode, { id: (100 + this.newCount), pId: treeNode.id, isParent: isParent, name: "new node" + (newCount++) });
        // } else {
        lin.http.communicate({
            url: 'article/save_update_class.action',
            params:{
                title:'新结点',
                show:true,
                type:node?3:4,
                parent: parent || this.params.params.id
            },result:(e)=>{
                console.log(e)
                var p = Object.create(e);
                p.isParent = !node;
                console.log(p)
                //var treeNode = this.tree.addNodes(null, { id: e.id, pId: 0, isParent: true, title: e.title });
                var treeNode = undefined;
                // debugger
                // if (parent) {
                    treeNode = this.tree.addNodes(node, p);
                // } else {
                //     treeNode = this.tree.addNodes(null, p);
                // }
                // }
                // if (treeNode) {
                this.tree.editName(treeNode[0]);
            }
        });
        
        // } else {
        //     alert("叶子节点被锁定，无法增加子节点");
        // }
    }

    renameNode(treeId, treeNode, newName, isCancel) {
        if (isCancel){
            return;
        }
        lin.http.communicate({
            url: 'article/save_update_class.action',
            params: {
                id: treeNode.id,
                title: newName || '',
                show: true,
                // type: treeNode.type,
                parent: treeNode.parent_id || this.params.params.id
            }, result: (e) => {
                treeNode.title = newName;
                this.tree.refresh();
            },fault:(e)=>{
                console.log(e);
            }
        });
    }

    removeNode(treeId, treeNode){
        confirm('是否确定要删除“'+treeNode.title+'”？',(r)=>{

            if(!r){
                return;
            }
            lin.http.communicate({
                url: 'article/delete_byid.action',
                params: {
                    id: treeNode.id
                }, result: (e) => {
                    console.log(this);
                    this.tree.removeNode(treeNode);
                    // treeNode.title = newName;
                    // this.tree.refresh();
                }, fault: (e) => {
                    console.log(e);
                }
            });
        });
    }

    processResult(e){
        console.log(e);
        console.log(this);

        var openFun = function(parent, items, id) {
            if (!items) {
                return;
            }
            for (var n = 0; n < items.length; n++) {
                if (items[n].id == id) {
                    items[n].open = true;
                    parent.open = true;
                }
                items[n].isParent = !parent;
                if (!items[n].items || items[n].items.length == 0) {
                    // items[n].target = '_self';
                    // if(items[n].type == 2){
                    //     items[n].url = '/article{{obj.id}}/clsdir/list'+items[n].id + '.html';
                    // }else{
                    //     items[n].url = '/article{{obj.id}}/clsdir/list'+items[n].id + '/content.html';
                    // }
                }
                openFun(items[n], items[n].items, id);
            }
        }
        // console.log(json)
        openFun(undefined, e, 0);

        //             var newCount = 1;
        //function addHoverDom(treeId, treeNode) {
        var addHoverDom = (treeId,treeNode) => {
            var sObj = $("#" + treeNode.tId + "_span");
            if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
            if (treeNode.type != 4) {
                return;
            }
            var addStr = "<span class='button' style='margin-left:2px; margin-right: -1px;background-position:-144px 0;*vertical-align:top;' id='addBtn_" + treeNode.tId
                + "' title='add node' onfocus='this.blur();'></span>";
            sObj.after(addStr);
            var btn = $("#addBtn_" + treeNode.tId);
            if (btn) btn.bind("click", () => {
                console.log(this);
                this.addSubDir(treeNode.id,treeNode);
                // var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                // zTree.addNodes(treeNode, { id: (100 + newCount), pId: treeNode.id, name: "new node" + (newCount++) });
                return false;
            });
        };
        function removeHoverDom(treeId, treeNode) {
            $("#addBtn_" + treeNode.tId).unbind().remove();
        };

        var setting = {
            // async:{
            //     enable:true,
            //     autoParam:['id'],
            //     url: '/article/save_update_class.action'
            // },
            data: {
                key: {
                    children: "items",
                    name: 'title'
                }
            },
            view: {
                dblClickExpand: true,
                showLine: true,
                selectedMulti: false,
                showIcon: false
                ,
                addHoverDom: addHoverDom,
                removeHoverDom: removeHoverDom
            },
            callback: {
                onClick: (event, treeId, treeNode) => {
                    if (treeNode.type == 3) {
                        this.router.navigate(['./Edit', { cid: treeNode.id, id: 0, isContent: true }]);
                    }
                }, onRemove: () => {
                    console.log('onRemove')
                }, onRename: () => {
                    console.log('onRename')
                }, beforeRemove: (treeId, treeNode) => {
                    console.log('beforeRemove')
                    this.removeNode(treeId, treeNode);
                    return false;
                }, beforeRename: (treeId, treeNode, newName, isCancel) => {
                    console.log('beforeRename')
                    this.renameNode(treeId, treeNode, newName, isCancel);
                    return false;
                }
            },
            edit: {
                enable: true,
                editNameSelectAll: true,
                showRemoveBtn: true,
                showRenameBtn: true,
                drag: {
                    isMove: true
                }
            }
        };
        //setting.edit.drag.isMove = true
        // $(document).ready(function(){
        this.tree = $.fn.zTree.init($("#article-class-tree"), setting, e);
        //t.selectNode(t.getNodeByParam("id", {{obj.aid}}));

        // this.router.navigate(['./Edit', { cid: e[0].id, id: 0, isContent: true }]);

    // }
    }
    loadDirectories(){

        setTimeout(()=>{

            lin.http.communicate({
                url:'/article/list.action',
                params:{
                    id:this.params.params.id
                },
                scope:this,
                result: this.processResult,
                fault: (e) => {
                    alert('数据加载失败！');
                }
            });
        },0);

    }
}


