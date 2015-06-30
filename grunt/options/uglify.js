module.exports = {
    options: {
        sourceMap: true,
        preserveComments: false
    },
    dist_js: {
        files: {
            '<%= config.dist %>/angular-svg-nodes.min.js': '<%= config.dist %>/angular-svg-nodes.js',
            '<%= config.dist %>/angular-svg-nodes.tmpl.min.js': '<%= config.dist %>/angular-svg-nodes.tmpl.js'
        }
    }
};
