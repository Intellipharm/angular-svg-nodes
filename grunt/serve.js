module.exports = function(grunt) {
    grunt.registerTask('serve', function () {
        grunt.task.run([
            'notify:serve',
            'watch'
        ]);
    });
};
