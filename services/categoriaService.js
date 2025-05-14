app.factory('CategoriaService', function($http) {
    var baseUrl = 'http://localhost:8000/api/categorias';

    return {
        obtenerCategorias: function() {
            return $http.get(baseUrl);
        },
        crearCategorias: function(data) {
            return $http.post(baseUrl, data);
        },
        eliminarCategorias: function(id) {
            return $http.delete(baseUrl + '/' + id);
        },
        actualizarCategorias: function(id, data) {
            return $http.put(baseUrl + '/' + id, data);
        }

    };
});
