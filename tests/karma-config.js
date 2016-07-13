var project_config = require( "../project-config" );

var dir_build 			= project_config.path.dir.build;

var port                    = project_config.port.karma;
var dir_source              = project_config.path.dir.source;
var dir_tests               = project_config.path.dir.tests;
var dir_coverage            = project_config.path.dir.coverage;
var file_config_jspm        = project_config.path.file.config.jspm;
var dir_jspm_packages       = project_config.path.dir.jspm_packages;

var base_path = dir_source;
var dir_root = base_path === "" ? "" : "../";

//-------------------------
// utils
//-------------------------

function normalizationBrowserName(browser) {
    return browser.toLowerCase().split(/[ /-]/)[0];
}

//-------------------------
// karma config
//-------------------------

var _config = {

    // autoWatch: false, // set in gulp or npm
    // singleRun: true, // set in gulp or npm

    basePath                : "../" + base_path,
    frameworks              : [ "jasmine", "jspm" ],
    files                   : [],
    exclude                 : [],

    jspm: {
        packages              : dir_root + dir_jspm_packages,
        config                : dir_root + file_config_jspm
    },

    port                    : port,
    colors                  : true,

    concurrency             : Infinity,
    plugins: [
        "karma-jasmine",
        "karma-jspm",
        "karma-phantomjs-launcher",
        "karma-babel-preprocessor",
        "karma-htmlfile-reporter",
        "karma-spec-reporter",
        "karma-coverage"
    ],

    reporters               : [ "spec", "html", "coverage" ],
    coverageReporter: {
        instrumenters: {
            isparta: require( "isparta" )
        },
        instrumenter: {},
        instrumenterOptions: {
            istanbul: { noCompact: true },
            isparta: { babel : { presets: [ "es2015", "stage-0" ] } }
        },
        reporters: [
            {
                includeAllSources: true,
                type        : "html",
                dir         : dir_root + dir_coverage,
                subdir      : normalizationBrowserName
            }
        ]
    },
    htmlReporter: {
        outputFile              : dir_root + dir_tests + "/karma/index.html",
        pageTitle               : "Karma Tests"
    },
    specReporter: {
        maxLogLines             : 1, // limit number of lines logged per test
        suppressErrorSummary    : true, // do not print error summary
        suppressFailed          : false, // do not print information about failed tests
        suppressPassed          : true, // do not print information about passed tests
        suppressSkipped         : true // do not print information about skipped tests
    },

    preprocessors: {}, // set below
    babelPreprocessor: {
        options: {
            presets: [ "es2015", "stage-0" ],
            "plugins": [
                ["transform-runtime", {
                    "polyfill": true,
                    "regenerator": true
                }]
            ],
            sourceMap           : "inline"
        },
        sourceFileName: function(file) {
            return file.originalPath;
        }
    },

    browsers                : [ "PhantomJS" ],

    // not sure if this is doing anything
    phantomjsLauncher: {
        settings: {
            clearMemoryCaches: true
        }
    }
};

//-------------------------
// karma config : proxies
//-------------------------

_config.proxies = {
    "/base/app"                 : "/src/app", // redirect "/base/modules" to "/src/app"
    "/base/jspm_packages"       : "/src/jspm_packages"
};

//-------------------------
// karma config : files
//-------------------------

var sut_dir = "app/**/";

_config.jspm.loadFiles = [ sut_dir + "*spec.js" ]; // load spec
_config.jspm.serveFiles = [ sut_dir + "!(*spec).js" ]; // serve js
_config.preprocessors[ sut_dir + "*spec.js" ] = [ "babel" ]; // preprocess spec
_config.preprocessors[ sut_dir + "!(*spec).js" ] = [ "babel", "coverage" ]; // preprocess & coverage js
_config.coverageReporter.instrumenter[ sut_dir + "*.js" ] = "isparta"; // report js

module.exports = function ( config ) {

    _config.logLevel = config.LOG_INFO; // config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG

    config.set( _config );
};
