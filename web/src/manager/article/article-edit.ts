
import {Component,
    View,
    ElementRef,
    Inject,
    AfterViewInit} from 'angular2/core';
//import {ModalDialogInstance, IModalContentData} from 'BootstrapModal';

import {RouteParams,Router} from 'angular2/router'

declare var jQuery:any;

@Component({
    selector: 'article-edit'
})
@View({
    templateUrl: './manager/article/article-edit.html'
 //   styleUrls:['./components/dev/dev-add.css'],
})
export class ArticleEdit implements AfterViewInit,OnInit{
    //dialog: ModalDialogInstance;
    //context: AdditionCalculateWindowData;
    elementRef:ElementRef;
    editor:any;
    title = '';
    abstract = '';
    params:RouteParams;
    router: Router


    //constructor(dialog: ModalDialogInstance, modelContentData: IModalContentData) {
    constructor(@Inject(ElementRef) elementRef:ElementRef,
        @Inject(RouteParams) params:RouteParams,
        @Inject(Router) router: Router){
        //this.dialog = dialog;
        //this.context = <AdditionCalculateWindowData>modelContentData;
        this.elementRef = elementRef;
        this.params = params;
        this.router = router;
        this.router.parent.loaded = true;

        if(this.params.params.id > 0){
            lin.http({
                url:'article/get.action',
                params:{id:this.params.params.id},
                result:(e)=>{
                    if(e){
                        this.title = e.title || '';
                        this.abstract = e.title || '';
                        this.editor.content = e.content || '';

                        console.log(e);
                    }
                }
            });
        }
    }

    ngOnInit(){ 
        //$(this.elementRef.nativeElement).find('.moving-box').draggable({ containment: '#draggable-parent
        
        this.editor = new lin.Editor({
            render: $(this.elementRef.nativeElement).find('#article-edit'),
            extensions: [lin.eventExtensions.markdownSectionParser,lin.eventExtensions.mathJax],
            css:{
                position: 'relative',
                width: '100%',
                'min-height': '450px',
                'background-color': 'transparent'
            }
        });
        this.editor.init();
        this.editor.run();
    }
    ngAfterViewInit(){

    }

    titleChanged($event){
        this.title = $event.target.value;
    }

    abstractChanged($event){
        this.abstract = $event.target.value;
    }

    save(show){

        lin.http({
            url:'article/save.action',
            params:{id:this.params.params.id || 0,
                title:this.title,
                abstract:this.abstract,
                content:this.editor.content,
                classId:this.params.params.classId
            },
            result:function(e){
                console.log(e)
            }
        });
    }

    cancel(){
        //window.history.back();
    }
}
/*export class DevAddWindowData implements IModalContentData{
    constructor(
        public num1: number,
        public num2: number
    ){}
}*/