var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var plumber = require('gulp-plumber');
var ErrorHandler = require('../utils/error-handler');

var project_config = require( "../../project-config" );

// var dir_source      = project_config.path.dir.source;
var dir_app 		= project_config.path.dir.app;
var file_rc_jshint  = project_config.path.file.rc.jshint;

gulp.task( 'lint-js', function() {
    // return gulp.src([ dir_source + "*.js" ])
    return gulp.src([ dir_app + "*.js" ])
        .pipe( plumber({ errorHandler: ErrorHandler }) )
        .pipe( jshint( file_rc_jshint ) )
        .pipe( jshint.reporter( 'jshint-stylish' ));
});
