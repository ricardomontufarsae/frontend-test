app.factory('AuthService', function() {
    return {
        isAuthenticated: function() {
            return !!localStorage.getItem('token');
        },
        getToken: function() {
            return localStorage.getItem('token');
        },
        logout: function() {
            localStorage.removeItem('token');
        }
    };
});
