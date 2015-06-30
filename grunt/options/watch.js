module.exports = {
    options: {
        livereload: true,
        spawn: false
    },

    // ng templates
    html: {
        files: ['<%= config.src %>/views/**/*.html'],
        tasks: ['ngtemplates:src']
    },

    // javascript
    js: {
        files: ['<%= config.src %>/scripts/**/*.js'],
        tasks: ['jshint:src', 'jscs:src']
    },

    // less
    less: {
        files: ['<%= config.src %>/less/**/*.less'],
        tasks: ['less:src']
    },
    less_examples_v0: {
        files: ['<%= config.examples %>/v0/less/**/*.less'],
        tasks: ['less:examples_v0']
    },

    // autoprefixer
    autoprefixer_src: {
        files: ['<%= config.src %>/less/**/*.less'],
        tasks: ['autoprefixer:src']
    },
    autoprefixer_examples_v0: {
        files: ['<%= config.examples %>/v0/less/**/*.less'],
        tasks: ['autoprefixer:examples_v0']
    }
};
