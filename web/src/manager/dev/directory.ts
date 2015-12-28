export class Directory{

    expanded = true;
    checked = false;

    constructor(public obj:any,
                public directories:Array<Directory>,
                public files:Array<any>) {
    }

    toggle(){
        this.expanded = !this.expanded;
    }

    getIcon(){

        if(this.expanded){
            return '-';
        }

        return '+';
    }

    check(){
        this.checked = !this.checked;
        this.checkRecursive(this.checked);
    }

    checkRecursive(state:boolean){
        this.directories.forEach(d => {
            d.checked = state;
            d.checkRecursive(state);
        });
    }
}
