import angular from 'angular';
import 'lodash';
import 'tweenmax';

import * as AngularSvgNodes from '../app/angular-svg-nodes';

import './app.css!'
import './angular-svg-nodes.css!';

// local

import _controller from './app-controller';

// module

let _module = angular.module('AngularSVGNodesDev', [
    AngularSvgNodes.module.name
]);

_module.controller('AppController', _controller);

// bootstrap

angular.element(document).ready(function() {
    return angular.bootstrap(document.body, [ _module.name ], {
        strictDi: true
    });
});