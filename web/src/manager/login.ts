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

//declare var lin:any;

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
    	//sessionStorage.setItem('user',true);
    	//this.router.navigate(['root']);
    	//this.router.navigateByUrl('');
        lin.http.communicate({
            url:'user/login.action',
            params:{},
            result:()=>{
                sessionStorage.setItem('user',{id:2});
                //this.router.navigate(['root']);
                this.router.navigateByUrl('');
            },fault:()=>{
                alert('登录失败！');
            }
        });
    }
}