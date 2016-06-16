/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function(global) {


   var extension = 'min.js';
   if(window.params.ts == 'true'){
    extension = 'ts';
   }else if(window.debug){
    extension = 'js';
   }
    //  map: {
 //      jquery: 'libs/jquery.js',
 //      lin:'libs/lin.js',
 //      typescript: 'libs/typescript.js',
 //      BootstrapModal: 'libs/BootstrapModal.js',
 //      ext: 'ext/angular2-ext.' + extension
 //    }
  // });
  // map tells the System loader where to look for things
  var map = {
    // 'manager':                        'manager', // 'dist',
    '@angular':                   'libs/angular',
    'angular2-in-memory-web-api': 'libs/angular2-in-memory-web-api',
    'rxjs':                       'libs/rxjs',
    jquery: 'libs/jquery.js',
    lin:'libs/lin.js',
    typescript: 'libs/typescript.js',
    ext: 'ext/angular2-ext.' + extension
  };

    var typescriptOptions ={
        noImplicitAny: true,
            // module: 'system',
            module: 'umd',//commonjs commonjs', 'amd', 'umd' or 'system'.
            target: 'ES5',
            declaration:true,
            emitDecoratorMetadata: true,
            experimentalDecorators: true
    };



   // System.config({
 //    transpiler: 'typescript',
    
  //  defaultJSExtensions: false,
 //    // defaultExtension:'.ts'
 //    packages: {        
 //          manager: {
 //            transpiler: 'typescript',
 //            //format: 'register',
 //            defaultExtension: extension
 //          },    
 //          ext: {
 //            transpiler: 'typescript',
 //            //format: 'register',
 //            defaultExtension: extension
 //          }
 //        },
  //  // ,
  //  map: {
 //      jquery: 'libs/jquery.js',
 //      lin:'libs/lin.js',
 //      typescript: 'libs/typescript.js',
 //      BootstrapModal: 'libs/BootstrapModal.js',
 //      ext: 'ext/angular2-ext.' + extension
 //    }
  // });


  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'manager':                        { main: 'main.js', 
    transpiler: 'typescript',
     defaultExtension: extension },
    'rxjs':                       { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
              ext: {
            transpiler: 'typescript',
            //format: 'register',
            defaultExtension: extension
          }
  };
  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'router-deprecated',
    'upgrade',
  ];
  // Individual files (~300 requests):
  function packIndex(pkgName) {
    packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
  }
  // Bundled (~40 requests):
  function packUmd(pkgName) {
    packages['@angular/'+pkgName] = { main: pkgName + '.umd.js', defaultExtension: 'js' };
  };
  // Most environments should use UMD; some (Karma) need the individual index files
  var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
  // Add package entries for angular packages
  ngPackageNames.forEach(setPackageConfig);
  var config = {
    map: map,
    packages: packages
  }
  System.config(config);
})(this);
