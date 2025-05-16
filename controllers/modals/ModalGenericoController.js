app.controller('ModalGenericoController', function ($scope, $uibModalInstance, config) {
    $scope.titulo = config.titulo || 'Formulario';
    $scope.objeto = angular.copy(config.objeto) || {};
    $scope.campos = config.campos || [];

    $scope.guardar = function () {
        $uibModalInstance.close($scope.objeto);
    };

    $scope.cancelar = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
