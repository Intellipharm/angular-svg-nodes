module.exports = {
    options: {
        config: '.jscsrc'
    },
    src: {
        src: [
            '<%= config.src %>/scripts/**/*.js',
            '!<%= config.src %>/scripts/angular-svg-nodes-templates.js'
        ]
    },
    tests: {
        src: [
            '<%= config.tests %>/**/*.js',
        ]
    },
    grunt: {
        src: [
            'Gruntfile.js',
            '<%= config.grunt %>/**/*.js'
        ]
    }
};
