var gulp   = require('gulp');
var karma = require('karma').Server;
var karmaRunner = require('karma').runner;

var project_config = require( "../../project-config" );

var file_config_karma  	= project_config.path.file.config.karma;
var port_karma  		= project_config.port.karma;

// var karma_server_options = require('../options/babel');

gulp.task( 'unit-test-js', function( done ) {

	var config = {
		configFile: __dirname + "/../../" + file_config_karma,
		singleRun: true,
		port: port_karma
	};

	var server = new karma( config, function( exitCode ) {
		console.log( 'Karma has exited with ' + exitCode );
		done();
	} );

	// server.on( 'browser_register', function ( browser ) {
	// 	console.log('browser_register');
	// } );
	//
	// server.on( 'browser_error', function ( browser ) {
	// 	console.log('browser_error');
	// } );
	//
	// server.on( 'browser_start', function ( browser ) {
	// 	console.log('browser_start');
	// } );
	//
	// server.on( 'browser_complete', function ( browser ) {
	// 	console.log('browser_complete');
	// } );
	//
	// server.on( 'browsers_change', function ( browser ) {
	// 	console.log('browsers_change');
	// } );
	//
	// server.on( 'run_start', function ( browser ) {
	// 	console.log('run_start');
	// } );
	//
	// server.on( 'run_complete', function ( browser ) {
	// 	console.log('run_complete');
	// } );

	server.start();
});

gulp.task( 'unit-test-js-watch', function( done ) {

	var config = {
		configFile: __dirname + "/../../" + file_config_karma,
		port: port_karma
	};

	var server = new karma( config, function( exitCode ) {
		console.log( 'Karma has exited with ' + exitCode );
		done();
	} );

	// server.on( 'browser_register', function ( browser ) {
	// 	console.log('browser_register');
	// } );
	//
	// server.on( 'browser_error', function ( browser ) {
	// 	console.log('browser_error');
	// } );
	//
	// server.on( 'browser_start', function ( browser ) {
	// 	console.log('browser_start');
	// } );
	//
	// server.on( 'browser_complete', function ( browser ) {
	// 	console.log('browser_complete');
	// } );
	//
	// server.on( 'browsers_change', function ( browser ) {
	// 	console.log('browsers_change');
	// } );
	//
	// server.on( 'run_start', function ( browser ) {
	// 	console.log('run_start');
	// } );
	//
	// server.on( 'run_complete', function ( browser ) {
	// 	console.log('run_complete');
	// } );

	server.start();
});
