//Service to manage login logic
angular.module('services').service('loginService', function($q, $state, base64, $http, $rootScope) {
    return {
        user: {data:{}},
        //Do the login
        login: function(email, pass) {
            var promise = $q.defer();
            var self = this;

            $http.defaults.headers.common.Authorization = "Basic " + base64.encode(email+':'+pass);

            $http.post('http://mesasave.herokuapp.com/api/v1/users/login')
            .success(function(response){
                localStorage.setItem('userData', JSON.stringify(
                    {
                        user: response,
                        base64: base64.encode(email+':'+pass)
                    }));

                self.user.data = JSON.parse(localStorage.getItem('userData'));

                promise.resolve(JSON.parse(localStorage.getItem('userData')));
            })
            .error(function(reason){
                promise.reject(reason);
            });

            return promise.promise;
        },
        //Check if user is logged in
        isLogged: function(){
            if(localStorage.getItem('userData')){
                return true;
            }

            return false;
        },
        //Do the logout
        logout: function(){
            this.user.data = {};
            localStorage.removeItem('userData');
        }
    }
})