let angular = require('angular');
let authenticationModule = require('./authentication/authenticationModule');
let navigationBarModule = require('./navigationBar/navigationBarModule');
let viewerModule = require('./viewer/viewerModule');
let collectablesChartModule = require('./charts/collectablesChartModule');

let api = angular.module('api', []);
api.constant('API_PATH', `https://${window.location.host}/application/api`);

let requires = [
    api.name,
    authenticationModule.name,
    navigationBarModule.name,
    viewerModule.name,
    collectablesChartModule.name
];

let application = angular.module('hackathon', requires);

module.exports = application;
