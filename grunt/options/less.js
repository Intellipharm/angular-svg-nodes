module.exports = function() {

    return {
        src: {
            options: {
                ieCompat: false,
                strictMath: true,
                compress: false
            },
            files: [{
                expand: false,
                src: '<%= config.src %>/less/angular-svg-nodes.less',
                dest: '<%= config.src %>/styles/angular-svg-nodes.css'
            }]
        },
        src_min: {
            options: {
                ieCompat: false,
                strictMath: true,
                compress: true
            },
            files: [{
                expand: false,
                src: '<%= config.src %>/less/angular-svg-nodes.less',
                dest: '<%= config.src %>/styles/angular-svg-nodes.min.css'
            }]
        },
        examples_v0: {
            options: {
                ieCompat: false,
                strictMath: true,
                compress: false
            },
            files: [
                {
                    expand: false,
                    src: '<%= config.examples %>/v0/less/angular-svg-nodes.less',
                    dest: '<%= config.examples %>/v0/styles/angular-svg-nodes.css'
                },
                {
                    expand: false,
                    src: '<%= config.examples %>/v0/less/page.less',
                    dest: '<%= config.examples %>/v0/styles/page.css'
                }
            ]
        }
    };
};
