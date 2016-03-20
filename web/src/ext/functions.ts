

// export function $setTimeout(fun,timeout){
//     //return System.import(path).then(c => c[name]);
//     debugger
//     var __this = this;
//     setTimeout(function(){
//     	debugger
//     	fun.call(__this);
//     	},timeout);
// }

// import {
//    Modal,
//    ModalDialogInstance,
//    ModalConfig,
//    YesNoModalContent,
//    YesNoModalContentData,
//    IModalContentData} from 'BootstrapModal';

import {
	Injectable
} from 'angular2/core';
//等版本稳定后，采用 angular2-modal 实现
@Injectable()
export class Http {
	
	constructor() {
		// code...
	}

	request(config){

	}
} 

// httpRequest(config) {
// 	// body...
// 	// var data = new YesNoModalContentData('Simple Large modal', 'Press ESC or click OK / outside area to close.', true);

// 	// var dialog = this.modal.open(component, elRef, containerInjector, App.modalConfigs[type]);
//  //        dialog.then(function(resultPromise) {
//  //            return resultPromise.result.then(function(result) {
//  //                self.lastModalResult = result;
//  //            }, function() {self.lastModalResult = 'Rejected!'});
//  //        });
// }