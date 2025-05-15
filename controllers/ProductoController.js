app.controller('ProductoController', function($scope, $filter, ProductoService, CategoriaService) {
    $scope.productos = [];
    $scope.productoSeleccionado = {};
    $scope.categorias = {};

    function cargarCategorias(){
        CategoriaService.obtenerCategorias().then(function(response) {
            $scope.categorias = response.data;
        });
    }

    cargarCategorias();

    function cargarProductos() {
        ProductoService.obtenerProductos().then(function(response) {
            $scope.productos = response.data;
        });
    }

    cargarProductos();

    $scope.editarProducto = function(producto) {
        $scope.productoSeleccionado = angular.copy(producto);
        $('#editarProductoModal').modal('show');
    };

    $scope.guardarCambios = function() {
        if($scope.productoSeleccionado._id){

            var id = $scope.productoSeleccionado._id;

            console.log($scope.productoSeleccionado);
            ProductoService.actualizarProducto(id, $scope.productoSeleccionado).then(function(response) {
                alert(response.data.message);
                $('#editarProductoModal').modal('hide');
                cargarProductos();
            }, function(error) {
                console.error('Error al actualizar:', error);
                alert('Error al guardar los cambios');
            });
        } else {
            ProductoService.crearProducto($scope.productoSeleccionado).then(function(response) {
                alert(response.data.message);
                $('#editarProductoModal').modal('hide');
                cargarProductos();
            });
        }
    };

    $scope.eliminarProducto = function(id) {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            ProductoService.eliminarProducto(id).then(function(response) {
                alert(response.data.message);
                cargarProductos();
            });
        }
    };

    $scope.filtroBusqueda = '';
    $scope.paginaActual = 1;
    $scope.itemsPorPagina = 5;
    $scope.productosFiltrados = [];
    $scope.productosPaginados = [];

    $scope.$watchGroup(['productos', 'filtroBusqueda', 'paginaActual'], function () {
        let filtrados = $filter('filter')($scope.productos, $scope.filtroBusqueda);

        $scope.productosFiltrados = filtrados;

        let inicio = ($scope.paginaActual - 1) * $scope.itemsPorPagina;
        let fin = inicio + $scope.itemsPorPagina;

        $scope.productosPaginados = filtrados.slice(inicio, fin);
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
        if (!$scope.productosFiltrados) return 1;
        return Math.ceil($scope.productosFiltrados.length / $scope.itemsPorPagina);
    };



    $scope.imprimir = function () {
        var contenido = document.getElementById('tablaProductos').outerHTML;

        var ventana = window.open('', '', 'height=700,width=900');
        ventana.document.write('<html><head><title>Imprimir Productos</title>');
        ventana.document.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">');
        ventana.document.write('</head><body>');
        ventana.document.write('<h3 class="text-center mt-3 mb-4">Listado de Productos</h3>');
        ventana.document.write(contenido);
        ventana.document.write('</body></html>');

        ventana.document.close();
        ventana.focus();
        ventana.print();
        ventana.close();
    };


    $scope.exportarExcel = function () {
        const datos = $scope.productos.map(p => ({
            Nombre: p.nombre,
            Descripción: p.descripcion,
            Precio: p.precio,
            Stock: p.stock,
            Código: p.codigo,
            Fecha:p.fecha_ingreso,
            Categoria: p.categoria.nombre
        }));

        const hoja = XLSX.utils.json_to_sheet(datos);
        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, "Productos");
        XLSX.writeFile(libro, "productos.xlsx");
    };


    $scope.abrirNuevo = function () {
        $scope.productoSeleccionado = {};
        $('#editarProductoModal').modal('show');
    };

});
