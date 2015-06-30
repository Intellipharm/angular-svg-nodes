(function() {

    "use strict";

    var default_config = {
        dist:       'dist',
        src:        'src',
        examples:   'examples',
        tests:      'tests',
        coverage:   'coverage',
        grunt:      'grunt'
    };

    module.exports = function (grunt) {

        // if this variable exists we have already set up grunt
        if (!grunt || !grunt.config || !grunt.config.data || !grunt.config.data.config || !grunt.config.data.config.dev) {

            // Load grunt modules from package.json automatically
            require('load-grunt-tasks')(grunt);

            // config variables, these are accessible like '<%= config.dev %>'
            var grunt_config = {
                config: default_config
            };

            grunt_config.config.pkg = grunt.file.readJSON('package.json');

            // loads tasks in the 'grunt' folder
            grunt.loadTasks('grunt');

            // load & merge all files in 'grunt/options' directory
            // ... and merge result with grunt_config
            var merged_config = grunt.util._.extend(grunt_config, loadAndMergeGruntOptions('./grunt/options/', grunt));

            // init config
            grunt.initConfig(merged_config);
        }
    };

    //--------------------------------------------
    // custom utils
    //--------------------------------------------

    /**
     * loadAndMergeGruntOptions
     *
     * @param path
     * @param grunt
     * @returns {{}}
     */
    function loadAndMergeGruntOptions(path, grunt) {
        var glob = require('glob');
        var object = {};
        var key;

        glob.sync('*', {cwd: path}).forEach(function(option) {
            key = option.replace(/\.js$/, '');
            object[key] = require(process.cwd() + path.replace('.', '') + option);
            if (typeof object[key] === 'function') {
                object[key] = object[key](grunt);
            }
        });

        return object;
    }
})();
