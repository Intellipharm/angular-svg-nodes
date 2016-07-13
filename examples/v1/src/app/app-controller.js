export default class AppController {

    constructor ($rootScope) {

        this.name = "AngularSvgNodes";
        this.heading = "Examples";
        this.nav = {
            initial_state: "Initial State",
            config: "Config",
            api: "API",
            callbacks: "Callbacks",
            transformer: "Transformer"
        };

        $rootScope.$on('$stateChangeSuccess', (event, to_state) => {
            this.heading = this.nav[ to_state.name ];
        });
    }
}

AppController.$inject = ['$rootScope'];