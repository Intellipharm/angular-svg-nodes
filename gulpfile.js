	require('require-dir')('gulp/tasks');

var gulp = require('gulp');
var runSequence = require('run-sequence');
var project_config = require( "./project-config" );

var dir_source = project_config.path.dir.source;

//---------------------------------
// build
//---------------------------------

gulp.task( 'build', [], function( callback ) {
	return runSequence(
		[ 'lint-js', 'code-style-js' ],
		// 'unit-test-js',
		[ 'compile-es6', 'copy-html', 'copy-json' ],
		callback
	);
});

//---------------------------------
// run
//---------------------------------

gulp.task( 'run', [	'build' ], function ( callback ) {
	gulp.watch( dir_source + "/*.js", [ 'compile-es6' ] );
});

//---------------------------------
// test
//---------------------------------

gulp.task( 'test', [], function ( callback ) {
	return runSequence(
		[ 'lint-js', 'code-style-js' ],
		'unit-test-js-watch',
		callback
	);
});

//---------------------------------
// default
//---------------------------------

gulp.task( 'default', [ 'run' ] );
