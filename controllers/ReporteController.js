app.controller('ReporteController', function($scope, ProductoService, CategoriaService) {
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
        var contenido = document.getElementById('tablaReportes').outerHTML;

        var ventana = window.open('', '', 'height=700,width=900');
        ventana.document.write('<html><head><title>Imprimir Reporte</title>');
        ventana.document.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">');
        ventana.document.write('</head><body>');
        ventana.document.write('<h3 class="text-center mt-3 mb-4">Reporte</h3>');
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
            Fecha:p.fecha_ingreso,
            Categoria: p.categoria.nombre
        }));

        const hoja = XLSX.utils.json_to_sheet(datos);
        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, "Reporte");
        XLSX.writeFile(libro, "reporte.xlsx");
    };
});
