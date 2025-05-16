app.controller('CategoriaController', function($scope, $filter, $uibModal, CategoriaService, UtilService) {
    $scope.categorias = [];
    $scope.categoriaSeleccionado = {};

    function cargarCategorias() {
        CategoriaService.obtenerCategorias().then(function(response) {
            $scope.categorias = response.data;
        });
    }
    cargarCategorias();

    $scope.abrirModalCategoria = function(categoria) {
        var modalInstance = $uibModal.open({
            animation: false,
            backdropClass: 'modal-backdrop-light',
            templateUrl: 'views/modals/modal-generico.html',
            controller: 'ModalGenericoController',
            resolve: {
                config: function() {
                    return {
                        titulo: categoria ? 'Editar categoria' : 'Nuevo Categoria',
                        objeto: categoria || {
                            nombre: '',
                            descripcion: '',
                            codigo: '',
                        },
                        campos: [
                            { etiqueta: 'Nombre', modelo: 'nombre', tipo: 'text', required: true },
                            { etiqueta: 'Descripción', modelo: 'descripcion', tipo: 'text' },
                            { etiqueta: 'Código', modelo: 'codigo', tipo: 'text' }
                        ]
                    };
                },
            }
        });
        modalInstance.result.then(function(categoriaActualizado) {
            if (categoria && categoria._id) {
                CategoriaService.actualizarCategorias(categoria._id, categoriaActualizado)
                    .then(cargarCategorias);
            } else {
                CategoriaService.crearCategorias(categoriaActualizado)
                    .then(cargarCategorias);
            }
        });

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
        UtilService.imprimirTabla('tablaCategorias', 'Listado de categorias');
    };

    $scope.exportarExcel = function () {
        const datos = $scope.categorias.map(c => ({
            Nombre: c.nombre,
            Descripción: c.descripcion,
            Código: c.codigo
        }));
        UtilService.exportarAExcel(datos, 'Categorias', 'Categorias');
    };


});
