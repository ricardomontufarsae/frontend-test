app.controller('ProductoController', function($scope, $filter, $uibModal, ProductoService, CategoriaService, UtilService) {
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

    $scope.abrirModalProducto = function(producto) {

        if (producto && producto.fecha_ingreso) {
            producto.fecha_ingreso = new Date(producto.fecha_ingreso);
        }

        CategoriaService.obtenerCategorias().then(function(categorias) {
            var modalInstance = $uibModal.open({
                backdropClass: 'modal-backdrop-light',
                animation: false,
                templateUrl: 'views/modals/modal-generico.html',
                controller: 'ModalGenericoController',
                resolve: {
                    config: function() {
                        return {
                            titulo: producto ? 'Editar Producto' : 'Nuevo Producto',
                            objeto: producto || {
                                nombre: '',
                                descripcion: '',
                                precio: 0,
                                stock: 0,
                                codigo: '',
                                fecha_ingreso: null,
                                categoria_id: null
                            },
                            campos: [
                                { etiqueta: 'Nombre', modelo: 'nombre', tipo: 'text', required: true },
                                { etiqueta: 'Descripción', modelo: 'descripcion', tipo: 'text' },
                                { etiqueta: 'Precio', modelo: 'precio', tipo: 'text', min: 0 },
                                { etiqueta: 'Stock', modelo: 'stock', tipo: 'number', min: 0 },
                                { etiqueta: 'Código', modelo: 'codigo', tipo: 'text' },
                                { etiqueta: 'Fecha de ingreso', modelo: 'fecha_ingreso', tipo: 'date' },
                                {
                                    etiqueta: 'Categoría',
                                    modelo: 'categoria_id',
                                    tipo: 'select',
                                    opciones: categorias.data.map(c => ({
                                        valor: c._id,
                                        nombre: c.nombre
                                    }))
                                }
                            ]
                        };
                    }
                }
            });

            modalInstance.result.then(function(productoActualizado) {
                if (producto && producto._id) {
                    ProductoService.actualizarProducto(producto._id, productoActualizado)
                        .then(cargarProductos);
                } else {
                    ProductoService.crearProducto(productoActualizado)
                        .then(cargarProductos);
                }
            });
        });
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
        UtilService.imprimirTabla('tablaProductos', 'Listado de productos')
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
        UtilService.exportarAExcel(datos, 'Productos', 'Productos');
    };



});
