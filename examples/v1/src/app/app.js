import angular from 'angular';
import 'lodash';
import router from 'oclazyload-systemjs-router';
import 'tweenmax';
import * as AngularSvgNodes from 'angular-svg-nodes';

import 'bootstrap/css/bootstrap.css!';
import './app.css!';
import './angular-svg-nodes.css!';

// local

import _controller from './app-controller';
import * as Router from './app-router';

// module

let _module = angular.module('AngularSVGNodesExamples', [
    AngularSvgNodes.module.name
]);

_module.controller('AppController', _controller);
_module.config(router(_module, []));
_module.config(Router.configureRoutes);
_module.config(Router.configureRouter);

// bootstrap

angular.element(document).ready(function() {
    return angular.bootstrap(document.body, [_module.name], {
        strictDi: true
    });
});