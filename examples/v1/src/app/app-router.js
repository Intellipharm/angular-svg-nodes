import example_initial_state_template from './1-initial-state/example.html!text';
import example_initial_state_controller from './1-initial-state/example-controller';
import example_config_template from './2-config/example.html!text';
import example_config_controller from './2-config/example-controller';
import example_api_template from './3-api/example.html!text';
import example_api_controller from './3-api/example-controller';
import example_callbacks_template from './4-callbacks/example.html!text';
import example_callbacks_controller from './4-callbacks/example-controller';
import example_transformer_template from './5-transformer/example.html!text';
import example_transformer_controller from './5-transformer/example-controller';
import example_reinitialisation_template from './6-reinitialisation/example.html!text';
import example_reinitialisation_controller from './6-reinitialisation/example-controller';

export function configureRoutes($stateProvider) {
	$stateProvider
		.state('initial_state', {
	        url: '/initial_state',
			template: example_initial_state_template,
			controller: example_initial_state_controller,
			controllerAs: 'Example'
		})
		.state('config', {
	        url: '/config',
			template: example_config_template,
			controller: example_config_controller,
			controllerAs: 'Example'
		})
		.state('api', {
	        url: '/api',
			template: example_api_template,
			controller: example_api_controller,
			controllerAs: 'Example'
		})
		.state('callbacks', {
	        url: '/callbacks',
			template: example_callbacks_template,
			controller: example_callbacks_controller,
			controllerAs: 'Example'
		})
		.state('transformer', {
	        url: '/transformer',
			template: example_transformer_template,
			controller: example_transformer_controller,
			controllerAs: 'Example'
		})
		.state('reinitialisation', {
	        url: '/reinitialisation',
			template: example_reinitialisation_template,
			controller: example_reinitialisation_controller,
			controllerAs: 'Example'
		})
    ;
}

configureRoutes.$inject = ['$stateProvider'];

export function configureRouter($locationProvider, $httpProvider, $urlRouterProvider) {
    $locationProvider.html5Mode({
        enabled: false,
        requireBase: false
    });
    $httpProvider.useApplyAsync(true);
    return $urlRouterProvider.otherwise('/');
}

configureRouter.$inject = ['$locationProvider', '$httpProvider', '$urlRouterProvider'];