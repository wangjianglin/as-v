
import {Component,
    View,
    ElementRef,
    Inject,
    AfterViewInit} from '@angular/core';
//import {ModalDialogInstance, IModalContentData} from 'BootstrapModal';

import {RouteParams, Router} from '@angular/router-deprecated'

declare var jQuery:any;

@Component({
    selector: 'article-edit',
    templateUrl: './manager/article/edit.html'
 //   styleUrls:['./components/dev/dev-add.css'],
})
export class Edit implements AfterViewInit,OnInit{
    //dialog: ModalDialogInstance;
    //context: AdditionCalculateWindowData;
    elementRef:ElementRef;
    editor:any;
    title = '';
    abstract = '';
    params:RouteParams;
    router: Router
    id;


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
        this.isBack = !this.params.params.isContent;

        console.log(params.params)

        //{id  cid  isContent}
        
    }

    ngOnInit(){ 
        console.log('--init--');
        //$(this.elementRef.nativeElement).find('.moving-box').draggable({ containment: '#draggable-parent
        
        this.editor = new lin.Editor({
            render: $(this.elementRef.nativeElement).find('#article-edit'),
            extensions: [new lin.eventExtensions.MarkdownSectionParser(),new lin.eventExtensions.MathJax(),
                new lin.eventExtensions.MarkdownExtra(),
                new lin.eventExtensions.UmlDiagrams()],
            css:{
                position: 'relative',
                width: '100%',
                'min-height': '650px',
                'background-color': 'transparent'
            }
        });
        this.editor.init();
        this.editor.run();

        var url = 'article/get.action';
        var id = this.params.params.id;
        if(this.params.params.isContent){
            url = 'article/get_bycid.action';
            id = this.params.params.cid;
        }

        if(id > 0){
            lin.http.communicate({
                url:url,
                params:{id:id},
                result:(e)=>{
                    if(e){
                        this.title = e.title || '';
                        this.id = e.id;
                        this.abstract = e.title || '';
                        this.editor.content = e.content || '';

                        console.log(e);
                    }
                },fault:function(e){
                    console.log(e);
                }
            });
        }
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

        lin.http.communicate({
            url:'article/save.action',
            params:{id:this.id || 0,
                title:this.title,
                abstract:this.abstract,
                content:this.editor.content,
                classId:this.params.params.cid
            },
            result:function(e){
                alert('保存成功！')
                console.log(e)
            },fault:function(){
                alert('保存失败！')
            }
        });
    }

    cancel(){
        window.history.back();
    }
}
/*export class DevAddWindowData implements IModalContentData{
    constructor(
        public num1: number,
        public num2: number
    ){}
}*/