//Manages the logic of Tables entity within the APP.
.controller('tablesCtrl', function($scope, $rootScope, $ionicModal, $timeout, $ionicLoading, tablesService, stationsService, $ionicHistory) {
  $scope.$on('showSearchTablesModal', function(e, data){
    $scope.openModal();
  })

  $ionicModal.fromTemplateUrl('templates/searchTablesModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })

  $scope.openModal = function() {
    $scope.search = {};
    $scope.modal.show()
  }

  $scope.stations = stationsService.stations;

  //Retrieve all available Tables in DB (paginated)
  $scope.getTables = function(calledFromPullToRefresh){
    $scope.searching = false;

    var queryString = '?skip='+ 0 +
                      '&limit='+ 100;

    tablesService.getTables(queryString).then(function(tables){
      $scope.tables = tables;
      $scope.$broadcast('scroll.refreshComplete');
    })
  }

  //Search all available Tables that match the filters
  $scope.searchTables = function() {
    $scope.searching = true;
    if($scope.search.saveSearch){
      var userData = JSON.parse(localStorage.getItem('userData') || {});
      var theRecentSearches = userData.recentSearches || [];
      theRecentSearches.push($scope.search);
      userData.recentSearches = theRecentSearches;
    }
    $ionicLoading.show({
      template: '<ion-spinner icon="ripple" style="stroke:white;fill;white"></ion-spinner>'
    });

    var queryString = '?_fromStation='+ $scope.search._fromStation +
                      '&_toStation='+ $scope.search._toStation +
                      '&fromDatetime='+ $scope.search.fromDatetime.toISOString();

    tablesService.getTables(queryString).then(function(tables){
      $scope.tables = tables;
      $ionicLoading.hide();
      $scope.closeModal();
    })
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
})