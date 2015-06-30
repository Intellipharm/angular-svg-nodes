module.exports = {
    src: {
        options: {
            module: 'AngularSvgNodes',
            url: function(url) {
                return url.replace('src/', '');
            }
        },
        src: ['<%= config.src %>/views/**/*.html'],
        dest: '<%= config.src %>/scripts/angular-svg-nodes-templates.js'
    }
};
