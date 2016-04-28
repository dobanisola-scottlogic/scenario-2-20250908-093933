function loginFormDirectiveFactory() {
    return {
        restrict: 'E',
        transclude: false,
        scope: {},
        replace: true,
        template: require('./loginForm.html'),
        controller: 'LoginFormController',
        controllerAs: 'controller'
    };
}

module.exports = loginFormDirectiveFactory;
