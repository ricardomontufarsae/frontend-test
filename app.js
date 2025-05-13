var app = angular.module('testcrud', ['ngRoute']);

app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {

    $routeProvider
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegisterController'
        })
        .when('/productos', {
            templateUrl: 'views/productos.html',
            controller: 'ProductoController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/login');
                    }
                }
            }
        })
        .when('/dashboard', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/login');
                    }
                }
            }
        })
        .when('/reportes', {
            templateUrl: 'views/reportes.html',
            controller: 'ReportesController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/login');
                    }
                }
            }
        })
        .otherwise({ redirectTo: '/login' });

    // Interceptor para enviar token
    $httpProvider.interceptors.push(['AuthService', function(AuthService) {
        return {
            request: function(config) {
                var token = AuthService.getToken();
                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            }
        };
    }]);
}]);
