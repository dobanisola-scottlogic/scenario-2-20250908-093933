const LOGIN_STATE = {
    NONE: 0,
    INPROGRESS: 1,
    AUTHOURIZED: 2,
    FAILED: 3
};

class LoginFormController {
    constructor($scope, authenticationService) {
        this.$scope = $scope;
        this.authenticationService = authenticationService;
        this.state = LOGIN_STATE.NONE;

        $scope.credentials = {
            username: '',
            password: ''
        };
    }

    login() {
        let credentials = this.$scope.credentials;
        this.state = LOGIN_STATE.INPROGRESS;

        this.authenticationService.login(credentials.username, credentials.password).then(
            () => {this.state = LOGIN_STATE.AUTHOURIZED;},
            () => {this.state = LOGIN_STATE.FAILED;}
        );
    }

    logout() {
        this.authenticationService.logout();
        this.state = this.state = LOGIN_STATE.NONE;
    }

    get isLoggedIn() {
        return this.state === LOGIN_STATE.AUTHOURIZED;
    }

    get isLoggingIn() {
        return this.state === LOGIN_STATE.INPROGRESS;
    }

    get isFailed() {
        return this.state === LOGIN_STATE.FAILED;
    }

    get loggedInUserName() {
        return this.authenticationService.getLoggedInUserName();
    }
}

LoginFormController.$inject = ['$scope', 'AuthenticationService'];

module.exports = LoginFormController;
