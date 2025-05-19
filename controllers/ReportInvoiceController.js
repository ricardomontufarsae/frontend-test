app.controller('ReportInvoiceController', function($scope, $uibModal, FacturaService, UtilService) {
    var vm = this;

    vm.productosFacturados = [];
    vm.ventasPorProducto = { labels: [], data: [] };
    vm.facturasPorMes = { labels: [], data: [] };

    vm.colorsFacturasPorMes = ['#007bff', '#6f42c1', '#20c997', '#ffc107', '#fd7e14', '#dc3545'];

    const categoriaColors = [
        '#4dc9f6', '#f67019', '#f53794', '#537bc4',
        '#acc236', '#166a8f', '#58595b', '#8c564b',
        '#ff6384', '#36a2eb', '#ffcd56', '#00a950'
    ];

    vm.chartOptions = {
        responsive: true,
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    const categoria = data.labels[tooltipItem.index];
                    const cantidad = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    return ' ' + categoria + ' - ' + cantidad;
                }
            }
        }
    };

    FacturaService.getProductosFacturados().then(function(response) {
        const facturas = response.data;
        const productosAplanados = [];
        const facturasPorMes = {};
        const cantidadPorCategoria = {};

        facturas.forEach(function(factura) {
            const mes = new Date(factura.fecha_factura).getMonth();

            if (!facturasPorMes[mes]) {
                facturasPorMes[mes] = 0;
            }

            factura.productos.forEach(function(prod) {
                productosAplanados.push({
                    nombre: prod.nombre,
                    numero_factura: factura.numero_factura,
                    fecha_factura: factura.fecha_factura,
                    precio_total: prod.subtotal
                });

                facturasPorMes[mes] += prod.subtotal;

                const categoria = prod.categoria_producto || 'Sin categoría';
                if (!cantidadPorCategoria[categoria]) {
                    cantidadPorCategoria[categoria] = 0;
                }
                cantidadPorCategoria[categoria] += prod.cantidad;
            });
        });

        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        vm.facturasPorMes = {
            labels: Object.keys(facturasPorMes).map(mes => meses[parseInt(mes)]),
            data: [Object.values(facturasPorMes)],
            colors: vm.colorsFacturasPorMes
        };

        const categorias = Object.keys(cantidadPorCategoria);
        const cantidades = Object.values(cantidadPorCategoria);
        const colores = categorias.map((_, i) => categoriaColors[i % categoriaColors.length]);

        vm.cantidadPorCategoria = {
            labels: categorias,
            data: [cantidades],
            colors: colores
        };

        vm.productosFacturados = productosAplanados;
    });

    $scope.verFactura = function(facturaNum) {
        FacturaService.getFacturaNumFac(facturaNum).then(function(response) {
            const factura = response.data;
            factura.fecha_factura = new Date(factura.fecha_factura);

            $uibModal.open({
                backdropClass: 'modal-backdrop-light',
                animation: false,
                size: 'lg',
                backdrop: 'static',
                templateUrl: 'views/modals/modal-factura.html',
                controller: 'ModalFacturaController',
                resolve: {
                    factura: function () {
                        return factura;
                    },
                    productosDisponibles: function (ProductoService) {
                        return ProductoService.obtenerProductos();
                    },
                    soloLectura: function () {
                        return true;
                    }
                }
            });
        }).catch(function(error) {
            console.error('Error al obtener la factura', error);
        });
    };

    $scope.imprimir = function () {
        UtilService.imprimirTabla('tablaReportInvoice', 'Reporte de factura por producto');
    };

    $scope.exportarExcel = function () {
        const datos = $scope.productosFacturados.map(p => ({
            Nombre: p.nombre,
            Numero: p.numero_factura,
            Fecha: p.fecha_factura,
            Precio: p.precio_total,
        }));
        UtilService.exportarAExcel(datos, 'Reporte de Facturas', 'Reporte');
    };
});
