var gulp = require('gulp');
var babel = require('gulp-babel');
var changed = require('gulp-changed');
var ngAnnotate = require('gulp-ng-annotate');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');

var ErrorHandler = require('../utils/error-handler');

var babel_compiler_options = require('../options/babel');
var project_config = require( "../../project-config" );

// var dir_source 			= project_config.path.dir.source;
var dir_app 			= project_config.path.dir.app;
var dir_build 			= project_config.path.dir.build;

gulp.task('compile-es6', function () {
    // return gulp.src( dir_source + "/*.js", {} )
    return gulp.src( dir_app + "/*.js", {} )
        .pipe( plumber({ errorHandler: ErrorHandler }) )
        // .pipe( changed( dir_build, { extension: '.js' }))
        .pipe( sourcemaps.init( { loadMaps: true } ))
        .pipe( babel( babel_compiler_options ))
        .pipe( ngAnnotate({
            sourceMap: false,
            gulpWarnings: true
        }))
        .pipe( sourcemaps.write( "/sourcemaps", { sourceRoot: dir_app + "/*.js" }))
        .pipe( gulp.dest( dir_build ));
});
