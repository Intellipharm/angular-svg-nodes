var project_config = require( "../../project-config" );

var project_name = project_config.project.name;

module.exports = {
    moduleName: project_name,
    export: 'system',
    modules: 'system'
};
