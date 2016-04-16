var gulp = require('gulp'),
    path = require("path");
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gzip = require('gulp-gzip');
var concat = require('gulp-concat');

var PATHS = {
    src: 'src/**/*.ts',
    typings: 'node_modules/angular2/bundles/typings/**/*.d.ts',

    libs: [
        "node_modules/angular2/bundles/angular2.dev.js",
        "node_modules/angular2/bundles/router.dev.js",
        "node_modules/systemjs/dist/system.src.js",
        "node_modules/systemjs/dist/system-polyfills.js",
        "node_modules/jquery/dist/jquery.js",
        "node_modules/rxjs/bundles/Rx.js",
        "node_modules/angular2/bundles/angular2-polyfills.js",
        "node_modules/typescript/lib/typescript.js",
        "node_modules/rxjs/bundles/Rx.umd.js",
        "node_modules/angular2/bundles/angular2-all.umd.js",
        "node_modules/bootstrap/dist/js/bootstrap.js",
        "bower_components/underscore/underscore.js",
        "bower_components/rangy/rangy-core.js",
        "bower_components/crel/crel.js",
        "bower_components/google-diff-match-patch-js/diff_match_patch.js",
        "bower_components/prism/components/prism-core.js",
        "bower_components/flowchart/release/flowchart-1.3.4.js",
        "bower_components/raphael/raphael.js"
    ],
    libCss:[
        "node_modules/bootstrap/dist/css/bootstrap.css"
    ],

    libFonts:[
        "node_modules/bootstrap/dist/fonts/**"
    ],

    html: 'src/**/*.html',
    js:'src/**/*.js',
    css:'src/**/*.css',
    png:'src/**/*.png',
    jpg:'src/**/*.jpg',
    gif:'src/**/*.gif',
    dist:"../dist/static/",
    ext:"src/ext/**"
};

gulp.task('clean', function (done) {
    var del = require('del');
    // del.sync('dist/', {force: true
    del(['../dist/static/'],{force:true},done);
});

gulp.task("libs", function(){
    
  //   var min = gulp.src(PATHS.libs).pipe(gulp.dest(PATHS.dist + "/libs"));

    // gulp.src(PATHS.libs).pipe(gulp.dest(PATHS.dist + "/libs"))//copy
    //     .pipe(gzip({append:false}))//gzip压缩
    //     .pipe(rename({extname: ".gzip"}))//重命名
    //     .pipe(gulp.dest(PATHS.dist + "/libs"));

    // gulp.src(PATHS.libs).pipe(gulp.dest(PATHS.dist + "/libs"))
    //     .pipe(uglify())//uglify压缩
    //     .pipe(rename({extname: ".min.js"}))//重命名
    //     .pipe(gulp.dest(PATHS.dist + "/libs"))
    //     .pipe(gzip({append:false}))//gzip压缩
    //     .pipe(rename({extname: ".gzip"}))//重命名
    //     .pipe(gulp.dest(PATHS.dist + "/libs"));

    gulp.src(PATHS.libs)
        // .pipe(uglify())//uglify压缩
        .pipe(gulp.dest(PATHS.dist + "/libs"));

    gulp.src(PATHS.libCss)
        // .pipe(uglify())//uglify压缩
        .pipe(gulp.dest(PATHS.dist + "/css"));

    gulp.src(PATHS.libFonts)
        // .pipe(uglify())//uglify压缩
        .pipe(gulp.dest(PATHS.dist + "/fonts"));

    gulp.src('src/font/**').pipe(gulp.dest(PATHS.dist + "/font"))


    // gulp.src('bower_components/MathJax/MathJax.js').pipe(gulp.dest(PATHS.dist + 'libs/MathJax'));
    // gulp.src('bower_components/MathJax/config/**').pipe(gulp.dest(PATHS.dist + 'libs/MathJax/config'));
    // gulp.src('bower_components/MathJax/extensions/**').pipe(gulp.dest(PATHS.dist + 'libs/MathJax/extensions'));
    // gulp.src('bower_components/MathJax/jax/**').pipe(gulp.dest(PATHS.dist + 'libs/MathJax/jax'));

})

gulp.task("ext",function(){
    var typescript = require('gulp-typescript');

    gulp.src(PATHS.ext).pipe(concat('angular2-ext.ts')).pipe(gulp.dest(PATHS.dist + "/ext"))
        .pipe(typescript({
            // noImplicitAny: true,
            // module: 'system',
            // // module: 'amd',//commonjs commonjs', 'amd', 'umd' or 'system'.
            // target: 'ES5',
            // declaration:true,
            // emitDecoratorMetadata: true,
            // experimentalDecorators: true
            "target": "ES5",
            "module": "system",
            "moduleResolution": "node",
            "sourceMap": true,
            "emitDecoratorMetadata": true,
            "experimentalDecorators": true,
            "removeComments": false,
            "noImplicitAny": false
        })).pipe(gulp.dest(PATHS.dist + "/ext"))
        .pipe(uglify())//uglify压缩
        .pipe(rename({extname: ".min.js"}))//重命名
        .pipe(gulp.dest(PATHS.dist + '/ext'));

});

gulp.task("html", function(){
    gulp.src(PATHS.html).pipe(gulp.dest(PATHS.dist) );
})

gulp.task("css", function(){
    gulp.src(PATHS.css).pipe(gulp.dest(PATHS.dist) );
})


gulp.task("images", function(){
    gulp.src(PATHS.png).pipe(gulp.dest(PATHS.dist) );
    gulp.src(PATHS.gif).pipe(gulp.dest(PATHS.dist) );
    gulp.src(PATHS.jpg).pipe(gulp.dest(PATHS.dist) );
})

gulp.task("js", function(){
    // gulp.src(PATHS.js).pipe(gulp.dest(PATHS.dist) );

    gulp.src(PATHS.js)
        // .pipe(uglify())//uglify压缩
        .pipe(gulp.dest(PATHS.dist));

    // gulp.src(PATHS.js).pipe(gulp.dest(PATHS.dist))
    //     .pipe(uglify())//uglify压缩
    //     .pipe(rename({extname: ".min.js"}))//重命名
    //     .pipe(gulp.dest(PATHS.dist))
    //     .pipe(gzip({append:false}))//gzip压缩
    //     .pipe(rename({extname: ".gzip"}))//重命名
    //     .pipe(gulp.dest(PATHS.dist));

})

gulp.task('ts2js', function () {
    var typescript = require('gulp-typescript');
    var tsResult = gulp.src([PATHS.src, PATHS.typings])
        .pipe(typescript({
            // noImplicitAny: true,
            // module: 'system',
            // // module: 'amd',//commonjs commonjs', 'amd', 'umd' or 'system'.
            // target: 'ES5',
            // declaration:true,
            // emitDecoratorMetadata: true,
            // experimentalDecorators: true
            "target": "ES5",
            "module": "system",
            "moduleResolution": "node",
            "sourceMap": true,
            "emitDecoratorMetadata": true,
            "experimentalDecorators": true,
            "removeComments": false,
            "noImplicitAny": false
        }));

    tsResult.js.pipe(gulp.dest(PATHS.dist))
        .pipe(uglify())//uglify压缩
        .pipe(rename({extname: ".min.js"}))//重命名
        .pipe(gulp.dest(PATHS.dist))
        .pipe(gzip({append:false}))//gzip压缩
        .pipe(rename({extname: ".gzip"}))//重命名
        .pipe(gulp.dest(PATHS.dist));

    // d//copy
    //     .pipe(gzip({append:false}))//gzip压缩
    //     .pipe(rename({extname: ".gzip"}))//重命名
    //     .pipe(gulp.dest(PATHS.dist));

    // d

     tsResult.dts.pipe(gulp.dest(PATHS.dist))
        
});

gulp.task('ts', function () {

    gulp.src([PATHS.src, PATHS.typings])
        .pipe(rename({extname: ".js"}))//重命名;
        .pipe(gulp.dest(PATHS.dist))

    gulp.src([PATHS.src, PATHS.typings])
        .pipe(gulp.dest(PATHS.dist))
        
});


gulp.task('default',['clean'], function () {
    
    gulp.src("src/images/**")
        .pipe(gulp.dest(PATHS.dist+"images/"))

    var isTs = gulp.env.ts;

    gulp.run('images');
    
    if(isTs){
        gulp.run('html','libs','ts','js','css','ext');
    }else{
        gulp.run('html','libs','ts2js','js','css','ext');
    }

    var http = require('http');
    var connect = require('connect');
    var serveStatic = require('serve-static');
    var open = require('open');

    var port = 9002, app;

    if(isTs){
        gulp.watch(PATHS.src, ['ts']);
    }else{
        gulp.watch(PATHS.src, ['ts2js']);
    }
    gulp.watch(PATHS.html, ['html']);
    gulp.watch(PATHS.js, ['js']);
    gulp.watch(PATHS.css, ['css']);
    // gulp.watch(PATHS.png, ['images']);
    // gulp.watch(PATHS.jpg, ['images']);
    // gulp.watch(PATHS.gif, ['images']);
    //gulp.watch(PATHS.ext, ['ext']);
    gulp.watch(PATHS.libs, ['libs']);

    app = connect().use( serveStatic(path.join(__dirname, PATHS.dist)) );
    http.createServer(app).listen(port, function () {
        //open('http://localhost:' + port);
    });
});
