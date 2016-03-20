
export function loadComponentAsync(name:String,path:String){
    return System.import(path).then(c => c[name]);
}
