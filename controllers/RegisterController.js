app.controller('RegisterController', function($scope, $http, $location) {
    $scope.user = {};

    $scope.register = function() {
        $http.post('http://localhost:8000/api/register', $scope.user)
            .then(function(response) {
                localStorage.setItem('token', response.data.authorisation.token);
                $location.path('/productos');
            }, function() {
                alert("Error al registrar");
            });
    };
});
