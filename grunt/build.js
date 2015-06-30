module.exports = function(grunt) {
    grunt.registerTask('build', [
        'notify:build',
        'clean',
        'jshint:src',
        'jscs:src',
        'ngtemplates:src',
        'less:src',
        'less:src_min',
        'less:examples_v0',
        'autoprefixer:src',
        'autoprefixer:examples_v0',
        'concat:dist_js',
        'concat:dist_js_tmpl',
        'concat:dist_css',
        'concat:dist_css_min',
        'uglify:dist_js',
        'notify:buildComplete'
    ]);
};