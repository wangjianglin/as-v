

import {Component,View, ElementRef, DynamicComponentLoader, ComponentRef, Renderer,
    bind, Injector, Injectable,
    provide, Type} from 'angular2/core';
//PromiseWrapper   isPresent  DomRenderer
import {PromiseWrapper} from 'angular2/src/facade/promise'
import {NgFor,NgIf} from 'angular2/common'

import {BrowserDomAdapter} from 'angular2/platform/browser'

var DOM = new BrowserDomAdapter();

/**
 * A Type used as a binding key for dialog window Components
 */
@Injectable()
export class IModalContentData{}


/**
 * Represents modal manager.
 * A modal manager opens a modal window and returns a modal lifecycle manager, a 'ModalDialogInstance'.
 * Notice the difference between a `Modal` and a `ModalDialogInstance`.
 */
@Injectable()
export class Modal {
    componentLoader: DynamicComponentLoader;
    domRenderer: Renderer;

    constructor(loader: DynamicComponentLoader, domRenderer: Renderer) {
        this.componentLoader = loader;
        this.domRenderer = domRenderer;
    }

    private createBackdrop(elementRef: ElementRef, providers: Array<any>, config: ModalConfig) : Promise<ComponentRef> {
        
        //return this.componentLoader.loadIntoNewLocation(ModalBackdrop, elementRef, injector)loadNextToLocation
        return this.componentLoader.loadNextToLocation(ModalBackdrop, elementRef,providers)
            .then((componentRef) => {
                var dr = this.domRenderer;
                var backdropElement = this.domRenderer.getRootNodes(componentRef.hostView.render.fragments[0])[0];
                //var backdropElement = componentRef.hostView.nativeElement;
                //DOM.addClass(backdropElement, 'modal-backdrop');
                DOM.setStyle(backdropElement, 'opacity', '.5')
                DOM.setStyle(backdropElement, 'position', 'fixed');
                DOM.setStyle(backdropElement, 'top', '0');
                DOM.setStyle(backdropElement, 'right', '0');
                DOM.setStyle(backdropElement, 'bottom', '0');
                DOM.setStyle(backdropElement, 'left', '0');
                DOM.setStyle(backdropElement, 'z-index', '1040');
                DOM.setStyle(backdropElement, 'background-color', '#000');

                //DOM.addClass(backdropElement, 'in');

                if (config.attachToBody) {
                    DOM.appendChild(DOM.query('body'), backdropElement);
                }
                else {
                    DOM.setStyle(backdropElement, 'position', 'absolute');
                    DOM.setStyle(backdropElement, 'height', elementRef.domElement.scrollHeight + 'px');
                    DOM.setStyle(backdropElement, 'width', elementRef.domElement.scrollWidth + 'px');
                    DOM.setStyle(elementRef.domElement, 'position', 'relative');
                    DOM.appendChild(elementRef.domElement, backdropElement);
                }

                return componentRef;
            });
    }

    /**
     * Open a new modal window.
     * @param componentType A Component class (type) to render in the window. e.g: `ModalContent`.
     * @param elementRef The parent location of the component. Note that it is not a rendered hierarchy, it is an injection hierarchy. e.g: the `ElementRef` of your current router view, etc...
     * @param parentInjector The injector used to create new component, if your `componentType` needs special injection (e.g: ModalContnetData) make sure you supply a suitable Injector.
     * @param config Modal configuration/options.
     * @returns Promise<ModalDialogInstance> A promise of ModalDialogInstance.
     */
    public open(componentType: Type, elementRef: ElementRef, providers: Array<any>, config?: ModalConfig) : Promise<ModalDialogInstance> {
        config = config || new ModalConfig();
        var dialog = new ModalDialogInstance(config);


        this.createBackdrop(elementRef, providers, config).then(backdropRef => {
            dialog.backdropRef = backdropRef;
        });

        // var containerInjector = parentInjector.resolveAndCreateChild([
            
        //var v =     bind(ModalDialogInstance).toValue(dialog)
        // ]);

        //providers = Injector.resolve([bind(ModalDialogInstance).toValue(dialog)]).concat(providers);
        providers.push(Injector.resolve([provide(ModalDialogInstance, {useValue: dialog})])[0]);


        return this.componentLoader.loadNextToLocation(BootstrapModalContainer, elementRef,providers)
            .then(bootstrapRef => {
                var dialogElement = this.domRenderer.getRootNodes(bootstrapRef.hostView.render.fragments[0])[0];
                //DOM.addClass(dialogElement, 'modal');

                DOM.setStyle(dialogElement, 'position', 'fixed');
                DOM.setStyle(dialogElement, 'top', '0');
                DOM.setStyle(dialogElement, 'right', '0');
                DOM.setStyle(dialogElement, 'bottom', '0');
                DOM.setStyle(dialogElement, 'left', '0');
                DOM.setStyle(dialogElement, 'z-index', '1050');
                DOM.setStyle(dialogElement, 'display', 'none');
                DOM.setStyle(dialogElement, 'overflow', 'hidden');
                DOM.setStyle(dialogElement, '-webkit-overflow-scrolling', 'touch');
                DOM.setStyle(dialogElement, 'outline', '0;');

                //DOM.addClass(dialogElement, 'in');
                DOM.setStyle(dialogElement, 'display', 'block');

                if (config.attachToBody) {
                    DOM.appendChild(DOM.query('body'), dialogElement);
                }
                else {
                    DOM.setStyle(dialogElement, 'position', 'absolute');
                    DOM.appendChild(elementRef.domElement, dialogElement);
                }

                dialog.bootstrapRef = bootstrapRef;

                return this.componentLoader.loadNextToLocation(componentType, bootstrapRef.location,providers)
                    .then(contentRef => {
                        
                        var userComponent = this.domRenderer.getRootNodes(contentRef.hostView.render.fragments[0])[0];
                        DOM.setStyle(dialogElement.children[0], 'display', 'block');
                        DOM.addClass(userComponent, 'modal-content');
                        DOM.setStyle(userComponent, 'display', 'block');

                        //DOM.appendChild(dialogElement.children[0], userComponent);
                        DOM.appendChild(dialogElement.querySelector('#content'), userComponent);

                        dialog.contentRef = contentRef;

                        return dialog;
                    }
                );
            }
        );
    }
}

/**
 * A configuration definition object.
 * Instruction for how to show a modal.
 */
@Injectable()
export class ModalConfig {

    title:string;
    closeText:string;
    /**
     * Size of the modal.
     * 'lg' or 'sm' only.
     * NOTE: No validation.
     * Default to 'lg'
     */
    size: string;

    /**
     * Describes if the modal is blocking modal.
     * A Blocking modal is not closable by clicking outside of the modal window.
     * Defaults to false.
     */
    isBlocking: boolean;

    /**
     * Keyboard value/s that close the modal.
     * Accepts either a single numeric value or an array of numeric values.
     * A modal closed by a keyboard stroke will result in a 'reject' notification from the promise.
     * Defaults to 27, set `null` implicitly to disable.
     */
    keyboard: Array<number> | number;

    attachToBody: boolean;

    //constructor(size: string = 'lg', isBlocking: boolean = false, keyboard: Array<number> | number = undefined, attachToBody: boolean = true) {
    constructor(){
        this.size = 'lg';
        this.isBlocking = false;
        this.attachToBody = true;

        // if (keyboard === undefined) {
        //     keyboard = [27];
        // }
        // else if (isPresent(keyboard) && !Array.isArray(<Array<number>>keyboard)) {
        //     keyboard = (!isNaN(<number>keyboard)) ? [<number>keyboard] : null;
        // }
        // this.keyboard = keyboard;
        this.keyboard = [27];
    }
}

/**
 * API to an open modal window.
 */
@Injectable()
export class ModalDialogInstance {
    private _bootstrapRef: ComponentRef;
    private _backdropRef: ComponentRef;
    private _resultDeffered: any;
    contentRef: ComponentRef;


    constructor(public config: ModalConfig) {
        this._resultDeffered = PromiseWrapper.completer();
    }

    set backdropRef(value: ComponentRef) {
        this._backdropRef = value;
    }
    set bootstrapRef(value: ComponentRef) {
        this._bootstrapRef = value;
    }

    /**
     * A Promise that is resolved on a close event and rejected on a dimiss event.
     * @returns {Promise<T>|any|*|Promise<any>}
     */
    get result():Promise<any> {
        return this._resultDeffered.promise;
    }

    private dispose() {
        this._bootstrapRef.dispose();
        this._backdropRef.dispose();
    }
    /**
     *  Close the modal with a return value, i.e: result.
     */
    close(result: any = null) {
        this.dispose();
        this._resultDeffered.resolve(result);
    }

    /**
     *  Close the modal without a return value, i.e: cancelled.
     *  This call is automatically invoked when a user either:
     *  - Presses an exit keyboard key (if configured).
     *  - Clicks outside of the modal window (if configured).
     *  Usually, dismiss represent a Cancel button or a X button.
     */
    dismiss(){
        this.dispose();
        this._resultDeffered.reject();
    }
}

/**
 * Represents the modal backdrop.
 */
@Component({
    selector: 'modal-backdrop'
})
@View({
    template: ''
})
export class ModalBackdrop {
    constructor() {}
}

/**
 * A component that acts as a top level container for an open modal window.
 */
@Component({
    selector: 'bootstrap-modal',
    hostAttributes: {
        'tabindex': '-1',
        'role': 'dialog'
    },
    hostListeners: {'body:^keydown': 'documentKeypress($event)', 'click': 'onClick()'}
})
@View({
    template: `
    <div style="position: absolute;
    margin: 10px;
    display: block;
    left: 10px;
    right: 10px;
    top: 10px;
    bottom: 10px;
    background-color: white;
    border: 1px solid rgba(30,30,30,0.5);
    border-radius: 5px;"
         [class.modal-lg]="dialogInstance.config.size == \'lg\'"
         [class.modal-sm]="dialogInstance.config.size == \'sm\'">
         <div style="height:40px;line-height: 40px;text-align:center;position:absolute;
             width: 100%;
    font-size: 16px;">
            {{title}}
         </div>
         <div style="height:40px;line-height: 40px;position:relative;
    border-bottom: 1px solid #666;
    font-size: 16px;">
            <span (click)="close()" style='float:right;padding: 0px 10px 0px 10px;'>{{closeText}}</span>
         </div>
         <div id='content'></div>
    </div>`
})
class BootstrapModalContainer {
    dialogInstance: ModalDialogInstance;
    title:String;
    closeText:String;

    constructor(dialogInstance: ModalDialogInstance) {
        this.dialogInstance = dialogInstance;
        this.title = dialogInstance.config.title || '窗口标题';
        this.closeText = dialogInstance.config.closeText || '关 闭';
    }

    close(){
        this.dialogInstance.close();
    }
    onClick() {
        !this.dialogInstance.config.isBlocking && this.dialogInstance.dismiss();
    }

    documentKeypress(event: KeyboardEvent) {
        if ( this.dialogInstance.config.keyboard &&
            (<Array<number>>this.dialogInstance.config.keyboard).indexOf(event.keyCode) > -1) {
            this.dialogInstance.dismiss();
        }
    }
}

/**
 * Data definition objet for `YesNoModalContent`
 */
export class YesNoModalContentData implements IModalContentData{
    constructor(
        public title: string = "Hello World Title",
        public body: string = "Hello World Body!",
        public hideNo: boolean = false,
        public yesText: string = "OK",
        public noText: string = "Cancel"
        ){}
}

/**
 * A 2 state bootstrap modal window, representing 2 possible answer, true/false.
 */
@Component({
    selector: 'modal-content'
})
@View({
    template: `
        <div class="modal-header">
            <h3 class="modal-title">{{context.title}}</h3>
        </div>
        <div class="modal-body">{{context.body}}</div>
        <div class="modal-footer">
            <button class="btn btn-primary" (click)="ok()">{{context.yesText}}</button>
            <button *ng-if="!context.hideNo" class="btn btn-warning" (click)="cancel()">{{context.noText}}</button>
        </div>`,
    directives: [NgIf]
})
export class YesNoModalContent {
    dialog: ModalDialogInstance;
    context: YesNoModalContentData;

    constructor(dialog: ModalDialogInstance, modelContentData: IModalContentData) {
        this.dialog = dialog;
        this.context = <YesNoModalContentData>modelContentData;
    }

    ok() {
        this.dialog.close(true);
    }

    cancel() {
        this.dialog.dismiss();
    }
}