
(function(){
	'use strict'
	// var scripts = document.getElementsByTagName('script');
	

	var s = window.location.search;//.substring(1);
	var params = {};
	var paramsValue = {};

	var setValue = function(name,value){
		paramsValue[name] = value;
		if(params.hasOwnProperty(name)){
			return;
		}
		Object.defineProperty(params,name,{
	    	// value:value,
	    	// writable:false,
	    	get:function(){
	    		return paramsValue[name];
	    	},
	    	enumerable:true,
	        configurable:false
	    });
	}
	if(s && s.length > 1){
		s = s.substring(1);
		var ss = s.split('&');
		for(var n=0;n<ss.length;n++){
			if(!ss[n] || ss[n] == ''){
				continue;
			}
			var items = ss[n].split('=');
			if(!items && items.length == 0){
				continue;
			}
			var itemValue = undefined;
			if(items.length > 1){
				itemValue = items[1];
			}else{
				itemValue = "";
			}
			if(params[items[0]] !== undefined){
				if(typeof params[items[0]] == 'object'){
					params[items[0]].push(itemValue);
					//setValue(items[0])
				}else{
					//params[items[0]] = [params[items[0]],itemValue];
					setValue(items[0],[params[items[0]],itemValue]);
				}
			}else{
				//params[items[0]] = itemValue;
				setValue(items[0],itemValue);
			}
		}
	}
	Object.defineProperty(window,'params',{
    	value:params,
    	writable:false,
    	enumerable:true,
        configurable:false
    });
    //params.debug = params.debug || sessionStorage.getItem('debug');
    //params.url = params.url || sessionStorage.getItem('url');
    //setValue('debug',params.debug || sessionStorage.getItem('debug'));
    //setValue('url',params.url || sessionStorage.getItem('url'));

	var debug = false;
    var hostname = window.location.hostname;
    //if(window.location.search.indexOf('debug=true') != -1){
    if(params['debug'] === 'true'){
        debug = true;
    //}else if(window.location.search.indexOf('debug=false') != -1){
    }else if(params['debug'] === 'false'){
        debug = false;
    }else{
        if(hostname === "" || hostname === "localhost"){
            debug = true;
        }else if(/^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/.test(hostname)){
            debug = true;
        }else{
            debug = false;
        }
    }
    Object.defineProperty(window,'debug',{
    	value:debug,
    	writable:false,
    	enumerable:true,
        configurable:false
    });

	// var debugJs = debug;

 //    if(window.params.debugJs == 'true'){
 //        debugJs = window.params.debugJs == 'true';
 //    }

    var HEAD = document.head || (document.getElementsByTagName("head")[0]);
 	if (!HEAD) {HEAD = document.childNodes[0]};

    var scripts = (document.documentElement || document).getElementsByTagName("script");
  	if (scripts.length === 0 && HEAD.namespaceURI){
    	scripts = document.getElementsByTagNameNS(HEAD.namespaceURI,"script");
  	}
  	
  	var namePattern = new RegExp("(^|/)lin-bootstrap\\.js(\\?.*)?$");
  	for (var i = scripts.length-1; i >= 0; i--) {
    	if ((scripts[i].src||"").match(namePattern)) {
    		var dm = scripts[i].getAttribute('data-main');
    		if(dm){
    			document.write('<script type="text/javascript" src="'+dm+'"></script>');
    		}
     //  	STARTUP.script = scripts[i].innerHTML;
     //  	if (RegExp.$2) {
	    //     var params = RegExp.$2.substr(1).split(/\&/);
	    //     for (var j = 0, m = params.length; j < m; j++) {
	    //       var KV = params[j].match(/(.*)=(.*)/);
	    //       if (KV) {STARTUP.params[unescape(KV[1])] = unescape(KV[2])}
	    //     }
     //  	}
	    //   CONFIG.root = scripts[i].src.replace(/(^|\/)[^\/]*(\?.*)?$/,'')
	    //     // convert rackspace to cdn.mathjax.org now that it supports https protocol
	    //     .replace(/^(https?:)\/\/[0-9a-f]+(-[0-9a-f]+)?.ssl.cf1.rackcdn.com\//,"$1//cdn.mathjax.org/");
	    //   BASE.Ajax.config.root = CONFIG.root;
	    //   break;
    	}
  	}

})();
