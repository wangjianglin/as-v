import {Component,Inject} from '@angular/core';

import {RouteParams,
	ROUTER_DIRECTIVES,
    Router} from '@angular/router-deprecated';

declare var lin: any;

@Component({
    selector: 'login',
    directives:[ROUTER_DIRECTIVES],
    //template:'ok--=====***'
    templateUrl: './admin/login.html'
})

//declare var lin:any;

export class Login {
    //id: string;
    //constructor(params: RouteParams){
    //    this.id = params.get('id');
    //}
    private router:Router;
    user = {};

    constructor(@Inject(Router)router:Router){
    	this.router = router;
        // this.user = {};
        // this.user.username = '';
        // this.user.password = '';
        this.user.username = localStorage.getItem('user.username') || '';
        sessionStorage.removeItem('user');
    }
    usernameChange(){
        localStorage.setItem('user.username',this.user.username);
    }
    loginClick(){
    	//sessionStorage.setItem('user',true);
    	//this.router.navigate(['root']);
    	//this.router.navigateByUrl('');
        // console.log(this.user);
        // console.log(this.password)
        lin.http.communicate({
            url:'user/login.action',
            params:{
                username: this.user.username,
                password:this.user.password
            },
            result:()=>{
                sessionStorage.setItem('user', { 'id': 2});
                //this.router.navigate(['root']);
                this.router.navigateByUrl('');
            },fault:(e)=>{
                alert(e && e.message || '登录失败！');
            }
        });
    }
}