import example_simple_template from './1-simple/example.html!text';
import example_simple_controller from './1-simple/example-controller';
import example_empty_template from './2-empty/example.html!text';
import example_empty_controller from './2-empty/example-controller';
import example_external_manipulation_template from './3-external-manipulation/example.html!text';
import example_external_manipulation_controller from './3-external-manipulation/example-controller';
import example_events_template from './4-events/example.html!text';
import example_events_controller from './4-events/example-controller';
import example_handling_controls_externally_template from './5-handling-controls-externally/example.html!text';
import example_handling_controls_externally_controller from './5-handling-controls-externally/example-controller';

export function configureRoutes($stateProvider) {
	$stateProvider
		.state('simple', {
	        url: '/simple',
			template: example_simple_template,
			controller: example_simple_controller,
			controllerAs: 'Example'
		})
		.state('empty', {
	        url: '/empty',
			template: example_empty_template,
			controller: example_empty_controller,
			controllerAs: 'Example'
		})
        .state('external_manipulation', {
	        url: '/external_manipulation',
			template: example_external_manipulation_template,
			controller: example_external_manipulation_controller,
			controllerAs: 'Example'
        })
        .state('events', {
            url: '/events',
            template: example_events_template,
            controller: example_events_controller,
            controllerAs: 'Example'
        })
        .state('handling_controls_externally', {
            url: '/handling_controls_externally',
            template: example_handling_controls_externally_template,
            controller: example_handling_controls_externally_controller,
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