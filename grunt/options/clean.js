module.exports = {
    tests: {
        files: [{
            dot: true,
            src: [
                '<%= config.coverage %>/*'
            ]
        }]
    },
    dist: {
        files: [{
            dot: true,
            src: [
                '.tmp',
                '<%= config.src %>/styles/*',
                '<%= config.dist %>/*'
            ]
        }]
    }
};
