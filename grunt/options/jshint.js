module.exports = {
    options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
    },
    src: [
        '<%= config.src %>/scripts/**/*.js',
        '!<%= config.src %>/scripts/angular-svg-nodes-templates.js'
    ],
    tests: [
        '<%= config.tests %>/**/*.js'
    ],
    grunt: [
        'Gruntfile.js',
        '<%= config.grunt %>/**/*.js'
    ]
};
