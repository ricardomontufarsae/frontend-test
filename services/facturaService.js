app.factory('FacturaService', function($http) {
    var baseUrl = 'http://localhost:8000/api/facturas';

    return {
        obtenerFacturas: function() {
            return $http.get(baseUrl);
        },
        crearFactura: function(data) {
            return $http.post(baseUrl, data);
        },
        eliminarFactura: function(id) {
            return $http.delete(baseUrl + '/' + id);
        },
        actualizarFactura: function(id, data) {
            return $http.put(baseUrl + '/' + id, data);
        }

    };
});
