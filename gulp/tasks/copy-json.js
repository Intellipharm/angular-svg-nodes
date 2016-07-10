var gulp = require('gulp');
// var changed = require('gulp-changed');
var rename = require('gulp-rename');

var project_config = require( "../../project-config" );

// var dir_source 			= project_config.path.dir.source;
var dir_app 			= project_config.path.dir.app;
var dir_build 			= project_config.path.dir.build;

gulp.task( 'copy-json', function () {
    // return gulp.src([ dir_source + "/*.json" ])
    return gulp.src([ dir_app + "/*.json" ])
        .pipe( rename( {} ))
        .pipe( gulp.dest( dir_build ));
});
