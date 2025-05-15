app.controller('FacturaController', function($scope, $filter, ProductoService, FacturaService) {
    $scope.facturas = [];
    $scope.facturaSeleccionado = { productos: [] };
    $scope.productosDisponibles = [];

    $scope.getNombre = function() {
        return localStorage.getItem('nombre');
    };

    function cargarProductos() {
        ProductoService.obtenerProductos().then(function(response) {
            //console.log(response.data)
            $scope.productosDisponibles = response.data;
        });
    }

    cargarProductos();

    function cargarFacturas() {
        FacturaService.obtenerFacturas().then(function(response) {
            //console.log(response.data)
            $scope.facturas = response.data;
        });
    }

    cargarFacturas();

    $scope.agregarProducto = function () {
        if (!$scope.facturaSeleccionado.productos) {
            $scope.facturaSeleccionado.productos = [];
        }
        $scope.facturaSeleccionado.productos.push({
            producto_id: '',
            cantidad: 1,
            precio_unitario: 0
        });
    };

    $scope.eliminarProducto = function (producto) {
        const index = $scope.facturaSeleccionado.productos.indexOf(producto);
        if (index > -1) {
            $scope.facturaSeleccionado.productos.splice(index, 1);
        }
    };

    $scope.calcularTotal = function () {
        if (!$scope.facturaSeleccionado.productos) return 0;

        return $scope.facturaSeleccionado.productos.reduce((acc, p) => {
            return acc + (p.cantidad * p.precio_unitario);
        }, 0);
    };

    $scope.editarFactura = function(factura) {
        $scope.facturaSeleccionado = angular.copy(factura);
        $('#editarFacturaModal').modal('show');
    };

    $scope.guardarCambios = function() {
        if($scope.facturaSeleccionado._id){

            var id = $scope.facturaSeleccionado._id;

            console.log($scope.facturaSeleccionado);
            FacturaService.actualizarFactura(id, $scope.facturaSeleccionado).then(function(response) {
                alert(response.data.message);
                $('#editarFacturaModal').modal('hide');
                cargarFacturas();
                cargarProductos();
            }, function(error) {
                console.error('Error al actualizar:', error);
                alert('Error al guardar los cambios');
            });
        } else {
            console.log($scope.facturaSeleccionado);
            FacturaService.crearFactura($scope.facturaSeleccionado).then(function(response) {
                alert(response.data.message);
                $('#editarFacturaModal').modal('hide');
                cargarFacturas();
                cargarProductos();
            });
        }
    };

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

    $scope.abrirNuevo = function () {
        $scope.facturaSeleccionado = {
            productos: [],
            fecha_factura: new Date(),
            emisor: $scope.getNombre()
        };
        $('#editarFacturaModal').modal('show');
    };


});
