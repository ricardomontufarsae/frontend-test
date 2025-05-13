app.controller('LoginController', function($scope, $http, $location) {
    $scope.user = {};

    $scope.login = function() {
        $http.post('http://localhost:8000/api/login', $scope.user)
            .then(function(response) {
                //console.log(response);
                localStorage.setItem('nombre', response.data.user.name);
                localStorage.setItem('token', response.data.authorisation.token);
                $location.path('/productos');
            }, function() {
                alert("Credenciales incorrectas");
            });
    };
});
