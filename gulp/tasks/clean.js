var gulp = require('gulp');
var del = require('del');
var vinylPaths = require('vinyl-paths');

var project_config = require( "../../project-config" );

var dir_build 			= project_config.path.dir.build;

gulp.task( 'clean', function () {
    return gulp.src([ dir_build ])
        .pipe( vinylPaths( del ));
});
