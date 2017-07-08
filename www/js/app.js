// Mesas AVE App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('services', []);

angular.module('starter', ['ionic', 'starter.controllers', 'services', 'ab-base64'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });


})

//states of the APP
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl',
    resolve: {
      stations: function(stationsService) {
        return stationsService.getStations();
      }
    }
  })

  .state('app.info', {
    url: "/info",
    views: {
      'menuContent': {
        templateUrl: "templates/info.html"
      }
    }
  })

  .state('app.myAccount', {
    url: "/myAccount",
    views: {
      'menuContent': {
        templateUrl: "templates/myAccount.html",
        controller: 'myAccountCtrl'
      }
    },
    module: 'private'
  })

  .state('app.myTables', {
    url: "/myTables",
    cache: false,
    views:{
      'menuContent':{
        templateUrl: "templates/myTables.html",
        controller: 'myTablesCtrl',
      }
    },
    module: 'private'
  })

  .state('app.myTable', {
    url: "/myTable/:tableId",
    views:{
      'menuContent':{
        templateUrl: "templates/myTable.html",
        controller: 'myTableCtrl',
      }
    },
    module: 'private'
  })

  .state('app.signin', {
    url: "/signin",
    views: {
      'menuContent': {
        templateUrl: "templates/signin.html"
      }
    }
  })

  .state('app.tables', {
    url: "/tables",
    views: {
      'menuContent': {
        templateUrl: "templates/tables.html",
        controller: 'tablesCtrl',
      }
    },

  })

  .state('app.table', {
    url: "/tables/:tableId",
    views: {
      'menuContent': {
        templateUrl: "templates/table.html",
        controller: 'tableCtrl',
        resolve: {
          table: function($stateParams, tablesService) {
            return tablesService.getTable($stateParams.tableId)
          }
        }
      }
    }
  });
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/tables');
});
