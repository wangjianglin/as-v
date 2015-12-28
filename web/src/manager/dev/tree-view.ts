
import {Component,View,EventEmitter,Output,Input} from 'angular2/core';

import {NgFor,NgIf} from 'angular2/common'

import {Directory} from './directory';

@Component({
    selector: 'tree-view',
    inputs: ['directories: directories']
})

@View({
    templateUrl: './manager/dev/tree-view.html',
    directives: [NgFor,TreeView,NgIf]
})

export class TreeView {
    @Input() directories: Array<Directory>;

    @Input() edit:Boolean = false;

    @Output() selected: EventEmitter = new EventEmitter();

    @Output() editClass: EventEmitter = new EventEmitter();

    itemClick(id){

        //console.log(this.directories.indexOf(dir));
    	this.selected.next(id);
    }

    editClassClick(id){
        this.editClass.next(id)
    }
}