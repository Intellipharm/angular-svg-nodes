module.exports = {
    options: {
        stripBanners: true,
        sourceMap: false,
        banner: '/*!\n * <%= config.pkg.name %> v<%= config.pkg.version %>\n * http://intellipharm.com/\n *\n * Copyright 2015 Intellipharm\n *\n * <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>\n *\n */\n'
    },
    dist_js: {
        dest: '<%= config.dist %>/angular-svg-nodes.js',
        src: [
            '<%= config.src %>/scripts/angular-svg-nodes.js',
            '<%= config.src %>/scripts/svg-vbox-directive.js',
            '<%= config.src %>/scripts/angular-svg-nodes-bg-col-grid-directive.js',
            '<%= config.src %>/scripts/angular-svg-nodes-controller.js',
            '<%= config.src %>/scripts/angular-svg-nodes-directive.js',
            '<%= config.src %>/scripts/angular-svg-nodes-line-directive.js',
            '<%= config.src %>/scripts/angular-svg-nodes-node-directive.js',
            '<%= config.src %>/scripts/angular-svg-nodes-settings.js'
        ]
    },
    dist_js_tmpl: {
        dest: '<%= config.dist %>/angular-svg-nodes.tmpl.js',
        src: [
            '<%= config.src %>/scripts/angular-svg-nodes.js',
            '<%= config.src %>/scripts/svg-vbox-directive.js',
            '<%= config.src %>/scripts/angular-svg-nodes-bg-col-grid-directive.js',
            '<%= config.src %>/scripts/angular-svg-nodes-controller.js',
            '<%= config.src %>/scripts/angular-svg-nodes-directive.js',
            '<%= config.src %>/scripts/angular-svg-nodes-line-directive.js',
            '<%= config.src %>/scripts/angular-svg-nodes-node-directive.js',
            '<%= config.src %>/scripts/angular-svg-nodes-settings.js',
            '<%= config.src %>/scripts/angular-svg-nodes-templates.js'
        ]
    },
    dist_css: {
        dest: '<%= config.dist %>/angular-svg-nodes.css',
        src: [
            '<%= config.src %>/styles/angular-svg-nodes.css'
        ]
    },
    dist_css_min: {
        dest: '<%= config.dist %>/angular-svg-nodes.min.css',
        src: [
            '<%= config.src %>/styles/angular-svg-nodes.min.css'
        ]
    }
};
