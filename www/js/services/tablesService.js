//Service to manage Tables logic
angular.module('services').service('tablesService', function($q, $timeout, $http) {
  return {
    tables: [],
    stations: [],
    myTables: [],
    //Retrieve all available Tables in DB
    getTables: function(queryString, calledFromMyTables) {
      var self = this;
      var promise = $q.defer();

      $http.get('http://mesasave.herokuapp.com/api/v1/tables' + queryString).success(function(response){
        calledFromMyTables ? self.myTables = response : self.tables = response;

        promise.resolve(response);
      });

      return promise.promise;
    },
    //Retrieve an existing Table by a given ID
    getTable: function(tableId, calledFromMyTables) {
      var theTable = {};
      var sourceTables = [];

      calledFromMyTables ? sourceTables = this.myTables : sourceTables = this.tables;

      sourceTables.forEach(function(table) {
        if (table._id === tableId) theTable = table;
      })

      return theTable;

    },
    //Creates new Table
    create: function(table){
      var promise = $q.defer();

      var userData = JSON.parse(localStorage.getItem('userData'))
      $http.defaults.headers.common.Authorization = "Basic " + userData.base64;

      $http.post('http://mesasave.herokuapp.com/api/v1/tables', table)
      .success(function(response){
        promise.resolve(response);
      }).error(function(reason){
        promise.reject(reason);
      });

      return promise.promise;
    },
    //Update and existing Table if it belongs to the user
    update: function(table){
      var promise = $q.defer();

      var userData = JSON.parse(localStorage.getItem('userData'))
      $http.defaults.headers.common.Authorization = "Basic " + userData.base64;

      $http.put('http://mesasave.herokuapp.com/api/v1/tables/' + table._id, table)
      .success(function(response){
        promise.resolve(response);
      }).error(function(reason){
        promise.reject(reason);
      });

      return promise.promise;
    },
    //Delete and existing Table if it belongs to the user
    delete: function(tableId){
      var promise = $q.defer();

      var userData = JSON.parse(localStorage.getItem('userData'));
      $http.defaults.headers.common.Authorization = "Basic " + userData.base64;

      $http.delete('http://mesasave.herokuapp.com/api/v1/tables/' + tableId)
      .success(function(response){
        promise.resolve(response);
      }).error(function(reason){
        promise.reject(reason);
      });

      return promise.promise;
    },
    //Retrieve all available Stations in DB
    getStations: function(){
      var self = this;
      var promise = $q.defer();

      $http.get('http://mesasave.herokuapp.com/api/v1/stations').success(function(response){
        self.stations = response
        promise.resolve(response);
      });

      return promise.promise;
    },
    //Retrieve the initial data to start the APP
    getDataFromServer: function(queryString){
      var promise1 = this.getTables(queryString);
      var promise2 = this.getStations();

      var allPromises = $q.defer();

      $q.all([promise1, promise2]).then(function(data){
        allPromises.resolve(data);
      });

      return allPromises.promise;
    }
  }
})