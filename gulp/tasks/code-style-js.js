var gulp    = require('gulp');
var jscs    = require('gulp-jscs');
var plumber = require('gulp-plumber');
var ErrorHandler = require('../utils/error-handler');

var project_config = require( "../../project-config" );

// var dir_source 			= project_config.path.dir.source;
var dir_app 			= project_config.path.dir.app;
var file_rc_jscs        = project_config.path.file.rc.jscs;

gulp.task( 'code-style-js', function() {
    // return gulp.src([ dir_source + "/!(*spec).js" ])
    return gulp.src([ dir_app + "/!(*spec).js" ])
        .pipe( plumber({ errorHandler: ErrorHandler }) )
        .pipe( jscs( file_rc_jscs ) );
});
