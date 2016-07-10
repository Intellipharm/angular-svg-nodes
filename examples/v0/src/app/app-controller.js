export default class AppController {

    constructor ($rootScope) {

        this.name = "AngularSvgNodes";
        this.heading = "Examples";
        this.nav = {
            simple: "Simple",
            empty: "Empty",
            external_manipulation: "External Manipulation",
            events: "Events",
            handling_controls_externally: "Handling Controls Externally"
        };

        $rootScope.$on('$stateChangeSuccess', (event, to_state) => {
            this.heading = this.nav[ to_state.name ] + " Example";
        });
    }
}

AppController.$inject = ['$rootScope'];