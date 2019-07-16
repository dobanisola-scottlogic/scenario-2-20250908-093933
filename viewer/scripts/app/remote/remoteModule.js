let angular = require('angular');
let remoteService = require('./RemoteService');

let remote = angular.module('hackathon.remote', []);

remote.service('RemoteService', remoteService);

remote.directive('hackRemotePanel', function() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {},
        replace: true,
        template: require('./content/remotePanel.html'),
        controller: require('./RemotePanelController'),
        controllerAs: 'controller'
    };
});

module.exports = remote;
