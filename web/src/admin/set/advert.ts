
import {Component, OnInit, ElementRef, Inject, Injector,
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

// import {
//    Modal,
//    ModalDialogInstance,
//    ModalConfig,
//    YesNoModalContent,
//    YesNoModalContentData,
//    IModalContentData} from 'BootstrapModal';
//import {DevAddWindow,DevAddWindowData} from './dev-add'

//import {DevList} from './dev-list'

declare var lin: any;

import {Empty} from 'ext';



// @Component({})
// export class Home {

//     constructor(@Inject(RouteParams) params:RouteParams,@Inject(Router) router: Router) {
//         //this.context = <AdditionCalculateWindowData>modelContentData;
//         //console.log(params.params)

//     }

// }

@Component({
    selector: 'advert',
    directives: [ROUTER_DIRECTIVES, NgFor, NgIf],
    // template: '
    // ,
    templateUrl: './admin/set/advert.html'
    //    styleUrls:['./app/dev/dev.css'],
})
// @RouteConfig([
//     // new Route({ path: '/', component: Empty, name: 'Home' }),
//     //{path: '/', redirectTo:['/Dev','DevList',{id:'3'}],name:'devroot'},
//     // new AsyncRoute({path: '/list/:id', 
//     //     loader: () => loadComponentAsync('ArticleList','./manager/article/article-list')
//     //     , name: 'ArticleList'}),
//     new AsyncRoute({
//         path: '/clsdir/:id/...',
//         loader: () => loadComponentAsync('ClsDir', './manager/article/clsdir')
//         , name: 'ClsDir'
//     }),
//     new AsyncRoute({
//         path: '/con/:id',
//         loader: () => loadComponentAsync('Edit', './manager/article/edit')
//         , name: 'Edit'
//     }),
//     new AsyncRoute({
//         path: '/cls/:id/...',
//         loader: () => loadComponentAsync('Cls', './manager/article/cls')
//         , name: 'Cls'
//     }),
//     new AsyncRoute({
//         path: '/condir/:id/...',
//         loader: () => loadComponentAsync('ConDir', './manager/article/condir')
//         , name: 'ConDir'
//     })
//     // ,
//     // new AsyncRoute({path: '/about', 
//     //     loader: () => ComponentHelper.LoadComponentAsync('About','./app/about')
//     //     , name: 'About'})
// ])
export class Advert implements OnInit {

    name: string;
    elementRef: ElementRef;
    edit: Boolean = true;
    router: Router;
    params: RouteParams;

    //static modalData = {
    //   'customWindow': new AdditionCalculateWindowData(2, 3)
    //}; 
    //id: string;
    //constructor(params: RouteParams){
    //    this.id = params.get('id');
    //}

    constructor(elementRef: ElementRef,
        router: Router,
        params: RouteParams) {
        this.name = '==='
        this.elementRef = elementRef;
        this.router = router;
        this.params = params;

        // console.log(this.params)
        // if (this.params.params.type == 0) {
        //     this.router.navigate(['ClsDir', { id: this.params.params.id }, 'Home']);
        // } else if (this.params.params.type == 1) {
        //     this.router.navigate(['ConDir', { id: this.params.params.id }, 'Home']);
        // } else if (this.params.params.type == 2) {
        //     this.router.navigate(['Cls', { id: this.params.params.id }, 'Home']);
        // } else if (this.params.params.type == 3) {
        //     this.router.navigate(['Edit', { id: this.params.params.id }]);
        // }
        // httpRequest();

        //     var dataConfig = new YesNoModalContentData('Simple Large modal', 'Press ESC or click OK / outside area to close.', true);

        // var dialog = this.modal.open(component, elRef, containerInjector, new ModalConfig("lg"));
        //     dialog.then(function(resultPromise) {
        //         return resultPromise.result.then(function(result) {
        //             self.lastModalResult = result;
        //         }, function() {self.lastModalResult = 'Rejected!'});
        //     });
        // this.loadDirectories();
    }


}


