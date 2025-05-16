app.controller('ReportInvoiceController', function($scope, $uibModal, FacturaService, UtilService) {
    $scope.productosFacturados = [];

    FacturaService.getProductosFacturados().then(function(response) {
        const facturas = response.data;
        const productosAplanados = [];

        facturas.forEach(function(factura) {
            factura.productos.forEach(function(prod) {
                productosAplanados.push({
                    nombre: prod.nombre,
                    numero_factura: factura.numero_factura,
                    fecha_factura: factura.fecha_factura,
                    precio_total: prod.subtotal
                });
            });
        });

        $scope.productosFacturados = productosAplanados;
    }).catch(function(error) {
        console.error("Error al cargar productos facturados", error);
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
        UtilService.imprimirTabla('tablaReportInvoice', 'Reporte de factura por producto')
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
