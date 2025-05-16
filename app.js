var app = angular.module('testcrud', ['ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {

    function requireAuth(AuthService, $location) {
        if (!AuthService.isAuthenticated()) {
            $location.path('/login');
        }
    }

    const authResolve = {
        auth: ['AuthService', '$location', requireAuth]
    };

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
            resolve: authResolve
        })
        .when('/categorias', {
            templateUrl: 'views/categorias.html',
            controller: 'CategoriaController',
            resolve: authResolve
        })
        .when('/dashboard', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController',
            resolve: authResolve
        })
        .when('/facturacion', {
            templateUrl: 'views/facturacion.html',
            controller: 'FacturaController',
            resolve: authResolve
        })
        .when('/reportes/productos', {
            templateUrl: 'views/reportProduct.html',
            controller: 'ReportProductController',
            resolve: authResolve
        })
        .when('/reportes/facturas', {
            templateUrl: 'views/reportInvoice.html',
            controller: 'ReportInvoiceController',
            resolve: authResolve
        })
        .otherwise({ redirectTo: '/login' });

    // Interceptor para añadir token
    $httpProvider.interceptors.push(['AuthService', function(AuthService) {
        return {
            request: function(config) {
                const token = AuthService.getToken();
                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            }
        };
    }]);
}]);
