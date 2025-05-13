app.controller('NavbarController', function($scope, $rootScope, AuthService, $location) {
    $scope.getNombre = function() {
        return localStorage.getItem('nombre');
    };

    $scope.isLoggedIn = function() {
        return AuthService.isAuthenticated();
    };

    $scope.logout = function() {
        AuthService.logout();
        $location.path('/login');
    };
});
