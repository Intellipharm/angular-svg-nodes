module.exports = {
    options: {
        browsers: ['last 1 version', 'ie 9']
    },
    src: {
        files: [
            {
                expand: true,
                src: '<%= config.src %>/styles/angular-svg-nodes.css'
            }
        ]
    },
    examples_v0: {
        files: [
            {
                expand: true,
                src: '<%= config.examples %>/v0/styles/angular-svg-nodes.css'
            }
        ]
    }
};
