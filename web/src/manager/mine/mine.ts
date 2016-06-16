
import {Component, OnInit, ElementRef, Inject, Injector,
    provide} from '@angular/core';

import {NgFor, NgIf} from '@angular/common'

import {RouteParams,
    RouteData,
    Router,
    Route,
    RouteConfig,
    ROUTER_DIRECTIVES,
    Location,
    AsyncRoute} from '@angular/router';

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
    selector: 'mine',
    directives: [ROUTER_DIRECTIVES, NgFor, NgIf],
    // template: '
    // ,
    templateUrl: './manager/mine/mine.html'
    //    styleUrls:['./app/dev/dev.css'],
})
@RouteConfig([
    new AsyncRoute({
            path: '/advert',
            useAsDefault:true,
            loader: () => loadComponentAsync('Advert', './manager/mine/advert')
        , name: 'Advert'
    })
    // ,
    // new AsyncRoute({
    //     path: '/',
    //     loader: () => loadComponentAsync('Advert', './admin/set/advert')
    //     , name: 'Advert'
    // })

])
export class Mine implements OnInit {

    name: string;
    elementRef: ElementRef;
    edit: Boolean = true;
    router: Router;
    params: RouteParams;
    urlPath: string;
    location: Location;
    //static modalData = {
    //   'customWindow': new AdditionCalculateWindowData(2, 3)
    //}; 
    //id: string;
    //constructor(params: RouteParams){
    //    this.id = params.get('id');
    //}

    constructor( @Inject(ElementRef) elementRef: ElementRef,
        @Inject(Router) router: Router,
        @Inject(RouteParams) params: RouteParams,
        @Inject(Location) location: Location) {
        this.name = '==='
        this.elementRef = elementRef;
        this.router = router;
        this.params = params;
        this.location = location;

        var a = function(r){
            if(!r){
                return "";
            }
            return a(r.parent) + "/" + r.currentInstruction.urlPath;
        }

        this.urlPath = a(router.parent);
        
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

    // ngOnInit() { 
    //     console.log(this);
    //     debugger
    // }
    getLinkStyle(path) {

        path = this.urlPath + path;
        if (path === this.location.path()) {
            return true;
        }
        else if (path.length > 0) {
            return this.location.path().indexOf(path) > -1;
        }
    }

}


