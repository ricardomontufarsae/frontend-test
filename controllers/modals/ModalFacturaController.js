app.controller('ModalFacturaController', function($scope, $uibModalInstance, factura, soloLectura, productosDisponibles) {
    $scope.factura = angular.copy(factura);
    $scope.productosDisponibles = productosDisponibles;
    $scope.soloLectura = soloLectura;

    $scope.agregarProducto = function () {
        $scope.factura.productos.push({ producto_id: '', cantidad: 1, precio_unitario: 0 });
    };

    $scope.eliminarProducto = function (producto) {
        var idx = $scope.factura.productos.indexOf(producto);
        if (idx !== -1) {
            $scope.factura.productos.splice(idx, 1);
        }
    };

    $scope.calcularTotal = function () {
        return $scope.factura.productos.reduce(function (acc, p) {
            return acc + (p.cantidad * p.precio_unitario || 0);
        }, 0);
    };

    $scope.guardar = function () {
        $uibModalInstance.close($scope.factura);
    };

    $scope.cancelar = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
