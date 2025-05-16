app.controller('ReportProductController', function($scope, ProductoService, CategoriaService, UtilService) {
    $scope.productos = [];
    $scope.categorias = [];
    $scope.filtroCategoria = '';
    $scope.filtroDesde = null;
    $scope.filtroHasta = null;

    function cargarCategorias(){
        CategoriaService.obtenerCategorias().then(function(response) {
            $scope.categorias = response.data.map(function(categoria) {
                return categoria.nombre;
            });
        });
    }

    cargarCategorias();
    function cargarProductos() {
        ProductoService.obtenerProductos().then(function(response) {
            $scope.productos = response.data;
        });
    }

    cargarProductos();

    $scope.filtrarProductos = function(producto) {
        if ($scope.filtroCategoria && producto.categoria.nombre !== $scope.filtroCategoria) {
            return false;
        }

        const ingreso = new Date(producto.fecha_ingreso);

        if ($scope.filtroDesde) {
            const desde = new Date($scope.filtroDesde);
            if (ingreso < desde) return false;
        }

        if ($scope.filtroHasta) {
            const hasta = new Date($scope.filtroHasta);
            if (ingreso > hasta) return false;
        }

        return true;
    };

    $scope.imprimir = function () {
        UtilService.imprimirTabla('tablaReportes', 'Reporte');
    };

    $scope.exportarExcel = function () {
        const datos = $scope.productos.map(p => ({
            Nombre: p.nombre,
            Descripción: p.descripcion,
            Precio: p.precio,
            Stock: p.stock,
            Fecha:p.fecha_ingreso,
            Categoria: p.categoria.nombre
        }));
        UtilService.exportarAExcel(datos, 'Reporte', 'reporte')
    };
});
