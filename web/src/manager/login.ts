import {Component,Inject} from 'angular2/core';

import {RouteParams,
	ROUTER_DIRECTIVES,
	Router} from 'angular2/router';


@Component({
    selector: 'login',
    directives:[ROUTER_DIRECTIVES],
    //template:'ok--=====***'
    templateUrl: './manager/login.html'
})

export class Login {
    //id: string;
    //constructor(params: RouteParams){
    //    this.id = params.get('id');
    //}
    private router:Router;

    constructor(@Inject(Router)router:Router){
    	this.router = router;
    }
    loginClick(){
    	localStorage.setItem('user',true);
    	//this.router.navigate(['root']);
    	this.router.navigateByUrl('');
    }
}