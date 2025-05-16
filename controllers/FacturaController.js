app.controller('FacturaController', function($scope, $filter, $uibModal, ProductoService, FacturaService) {
    $scope.facturas = [];
    $scope.facturaSeleccionado = { productos: [] };
    $scope.productosDisponibles = [];

    $scope.getNombre = function() {
        return localStorage.getItem('nombre');
    };

    function cargarProductos() {
        ProductoService.obtenerProductos().then(function(response) {
            $scope.productosDisponibles = response.data;
        });
    }
    cargarProductos();

    function cargarFacturas() {
        FacturaService.obtenerFacturas().then(function(response) {
            $scope.facturas = response.data;
        });
    }
    cargarFacturas();

    $scope.eliminarFactura = function(id) {
        if (confirm('¿Estás seguro de eliminar esta factura?')) {
            FacturaService.eliminarFactura(id).then(function(response) {
                alert(response.data.message);
                cargarFacturas();
                cargarProductos();
            });
        }
    };

    $scope.filtroBusqueda = '';
    $scope.paginaActual = 1;
    $scope.itemsPorPagina = 5;
    $scope.facturasFiltrados = [];
    $scope.facturasPaginados = [];

    $scope.$watchGroup(['facturas', 'filtroBusqueda', 'paginaActual'], function () {
        let filtrados = $filter('filter')($scope.facturas, $scope.filtroBusqueda);
        $scope.facturasFiltrados = filtrados;

        let inicio = ($scope.paginaActual - 1) * $scope.itemsPorPagina;
        let fin = inicio + $scope.itemsPorPagina;

        $scope.facturasPaginados = filtrados.slice(inicio, fin);
    });

    $scope.paginaAnterior = function() {
        if ($scope.paginaActual > 1) {
            $scope.paginaActual--;
        }
    };

    $scope.paginaSiguiente = function() {
        if ($scope.paginaActual < $scope.totalPaginas()) {
            $scope.paginaActual++;
        }
    };

    $scope.totalPaginas = function() {
        if (!$scope.facturasFiltrados) return 1;
        return Math.ceil($scope.facturasFiltrados.length / $scope.itemsPorPagina);
    };

    $scope.abrirModalFactura = function(factura) {
        console.log(factura);

        if (factura && factura.fecha_factura) {
            factura.fecha_factura = new Date(factura.fecha_factura);
        }

        ProductoService.obtenerProductos().then(function(res) {
            var modalInstance = $uibModal.open({
                backdropClass: 'modal-backdrop-light',
                animation: false,
                size: 'lg',
                backdrop: 'static',
                templateUrl: 'views/modals/modal-factura.html',
                controller: 'ModalFacturaController',
                resolve: {
                    factura: function() {
                        return factura ? angular.copy(factura) : {
                            emisor: '',
                            receptor: '',
                            numero_factura: '',
                            fecha_factura: new Date(),
                            productos: []
                        };
                    },
                    productosDisponibles: function() {
                        return res.data;
                    },
                    soloLectura: function () {
                        return false;
                    }
                }
            });

            modalInstance.result.then(function(facturaGuardada) {
                if (facturaGuardada._id) {
                    FacturaService.actualizarFactura(facturaGuardada._id, facturaGuardada).then(() => {
                        cargarFacturas();
                        cargarProductos();
                    });
                } else {
                    FacturaService.crearFactura(facturaGuardada).then(() => {
                        cargarFacturas();
                        cargarProductos();
                    });
                }
            });
        });
    };
});
