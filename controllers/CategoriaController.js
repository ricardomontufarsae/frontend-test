app.controller('CategoriaController', function($scope, $filter, CategoriaService) {
    $scope.categorias = [];
    $scope.categoriaSeleccionado = {};

    function cargarCategorias() {
        CategoriaService.obtenerCategorias().then(function(response) {
            $scope.categorias = response.data;
        });
    }

    cargarCategorias();

    $scope.editarCategoria = function(categoria) {
        $scope.categoriaSeleccionado = angular.copy(categoria);
        $('#editarCategoriaModal').modal('show');
    };

    $scope.guardarCambios = function() {
        if($scope.categoriaSeleccionado._id){

            var id = $scope.categoriaSeleccionado._id;

            CategoriaService.actualizarCategorias(id, $scope.categoriaSeleccionado).then(function(response) {
                alert(response.data.message);
                $('#editarCategoriaModal').modal('hide');
                cargarCategorias();
            }, function(error) {
                console.error('Error al actualizar:', error);
                alert('Error al guardar los cambios');
            });
        } else {
            CategoriaService.crearCategorias($scope.categoriaSeleccionado).then(function(response) {
                alert(response.data.message);
                $('#editarCategoriaModal').modal('hide');
                cargarCategorias();
            });
        }
    };

    $scope.eliminarCategoria = function(id) {
        if (confirm('¿Estás seguro de eliminar esta categoria?')) {
            CategoriaService.eliminarCategorias(id).then(function(response) {
                alert(response.data.message);
                cargarCategorias();
            });
        }
    };

    $scope.filtroBusqueda = '';
    $scope.paginaActual = 1;
    $scope.itemsPorPagina = 5;
    $scope.categoriasFiltrados = [];
    $scope.categoriasPaginados = [];

    $scope.$watchGroup(['categorias', 'filtroBusqueda', 'paginaActual'], function () {
        let filtrados = $filter('filter')($scope.categorias, $scope.filtroBusqueda);

        $scope.categoriasFiltrados = filtrados;

        let inicio = ($scope.paginaActual - 1) * $scope.itemsPorPagina;
        let fin = inicio + $scope.itemsPorPagina;

        $scope.categoriasPaginados = filtrados.slice(inicio, fin);
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
        if (!$scope.categoriasFiltrados) return 1;
        return Math.ceil($scope.categoriasFiltrados.length / $scope.itemsPorPagina);
    };

    $scope.imprimir = function () {
        var contenido = document.getElementById('tablaCategorias').outerHTML;

        var ventana = window.open('', '', 'height=700,width=900');
        ventana.document.write('<html><head><title>Imprimir Categorias</title>');
        ventana.document.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">');
        ventana.document.write('</head><body>');
        ventana.document.write('<h3 class="text-center mt-3 mb-4">Listado de Categorias</h3>');
        ventana.document.write(contenido);
        ventana.document.write('</body></html>');

        ventana.document.close();
        ventana.focus();
        ventana.print();
        ventana.close();
    };


    $scope.exportarExcel = function () {
        const datos = $scope.categorias.map(c => ({
            Nombre: c.nombre,
            Descripción: c.descripcion,
            Código: c.codigo
        }));

        const hoja = XLSX.utils.json_to_sheet(datos);
        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, "Categorias");
        XLSX.writeFile(libro, "categorias.xlsx");
    };


    $scope.abrirNuevo = function () {
        $scope.categoriaSeleccionado = {};
        $('#editarCategoriaModal').modal('show');
    };

});
