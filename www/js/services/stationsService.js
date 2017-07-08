//Service to manage Stations logic
angular.module('services').service('stationsService', function($q, $timeout, $http, $ionicLoading) {
  return {
    stations: [],
    //Retrieve all available stations in DB
    getStations: function(){
      $ionicLoading.show({
        template: '<ion-spinner icon="ripple" style="stroke:white;fill;white"></ion-spinner>'
      });
      var promise = $q.defer();
      var self = this;
        $http.get('http://mesasave.herokuapp.com/api/v1/stations').success(function(response){
          self.stations = response
          $ionicLoading.hide();
          promise.resolve();

        });

        return promise.promise;
    },
  }
})