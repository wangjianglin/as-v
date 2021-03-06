
import {Component, View,Inject} from '@angular/core';

import {RouteParams, Router} from '@angular/router-deprecated'

declare var lin:any;

@Component({
    selector: 'article-list',
    templateUrl: './manager/article/list.html'
})
export class List {
    //context: AdditionCalculateWindowData;
    router: Router;
    params:RouteParams;

    constructor(@Inject(RouteParams) params:RouteParams,@Inject(Router) router: Router) {
        //this.context = <AdditionCalculateWindowData>modelContentData;
        //console.log(params.params)
        this.router = router;
        this.id = params.params.id;
        this.params = params;

        lin.http.communicate({
            url:'/article/article_list.action',
            params:{id:this.id},
            result:(e) => {
                
                this.articles = e;
                // console.log(e);
            }
        });
    }

    addArticle() {
    	this.router.parent.navigate( ['./Edit', { cid:this.params.params.id,id: 0 }] );
    }

    editArticle(id) {
        this.router.parent.navigate( ['./Edit', { cid:this.params.params.id,id: id }] );
    }
}
