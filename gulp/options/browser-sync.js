var project_config = require( "../../project-config" );

var dir_build 			= project_config.path.dir.build;
var file_config_jspm    = project_config.path.file.config.jspm;
var dir_jspm_packages   = project_config.path.dir.jspm_packages;

module.exports = {
	open: false,
	ui: false,
	notify: false,
	ghostMode: false,
	port: process.env.PORT || 9000,
	server: {
		baseDir: [ dir_build ],
		routes: {
			'/config.js': file_config_jspm,
			'/jspm-config.js': file_config_jspm,
			'/jspm_packages': dir_jspm_packages
		}
	}
};
