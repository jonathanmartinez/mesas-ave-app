//Service to manage Users logic
angular.module('services').service('usersService', function($q, $state, $http) {
    return {
        //Creates new user
        create: function(user) {
            var promise = $q.defer();

            $http.post('http://api.randomuser.me/?gender=male')
            .success(function(response){
                user.imageURL = response.results[0].user.picture.medium;

                $http.post('http://mesasave.herokuapp.com/api/v1/users', user)
                .success(function(response){
                    promise.resolve(response);
                })
                .error(function(response){
                    promise.reject(response)
                });
            })
            .error(function(response){
                $http.post('http://mesasave.herokuapp.com/api/v1/users', user)
                .success(function(response){
                    promise.resolve(response);
                })
                .error(function(response){
                    promise.reject(response)
                });
            });



            return promise.promise;
        },
        //Updates an existing user (only itself)
        update: function(user) {
            var promise = $q.defer();

            var userData = JSON.parse(localStorage.getItem('userData'))
            $http.defaults.headers.common.Authorization = "Basic " + userData.base64;

            $http.put('http://mesasave.herokuapp.com/api/v1/users/' + user._id, user)
            .success(function(response){
                promise.resolve(response);
            })
            .error(function(response){
                promise.reject(response)
            });

            return promise.promise;
        },
        //Deletes an existing user (only itself)
        delete: function(userId) {
            var promise = $q.defer();

            var userData = JSON.parse(localStorage.getItem('userData'))
            $http.defaults.headers.common.Authorization = "Basic " + userData.base64;

            $http.get('http://mesasave.herokuapp.com/api/v1/users/' + user._id)
            .success(function(response){
                promise.resolve(response);
            })
            .error(function(response){
                promise.reject(response)
            });

            return promise.promise;
        },

    }
})