app.factory('ProductoService', function($http) {
    var baseUrl = 'http://localhost:8000/api/productos';

    return {
        obtenerProductos: function() {
            return $http.get(baseUrl);
        },
        crearProducto: function(data) {
            return $http.post(baseUrl, data);
        },
        eliminarProducto: function(id) {
            return $http.delete(baseUrl + '/' + id);
        },
        actualizarProducto: function(id, data) {
            return $http.put(baseUrl + '/' + id, data);
        }

    };
});
