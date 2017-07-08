//Mages all the logic for the Tables of the user in session
.controller('myTablesCtrl', function(stationsService, tablesService, $scope, $stateParams, usersService, loginService, $ionicModal, $ionicLoading, $timeout, $rootScope) {
  $scope.stations = stationsService.stations;

  var queryString = '?_user=' + JSON.parse(localStorage.getItem(('userData'))).user._id;
  $ionicLoading.show({
      template: '<ion-spinner icon="ripple" style="stroke:white;fill;white"></ion-spinner>'
    });
  tablesService.getTables(queryString, true).then(function(tables){
    $scope.tables = tables
    $ionicLoading.hide();
  })

  $scope.newTableData = {};


  $ionicModal.fromTemplateUrl('templates/newTableModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })

  $scope.openModal = function() {
    $scope.modal.show()
  }

  //Creates a new Table for the user in session.
  $scope.createTable = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="ripple" style="stroke:white;fill;white"></ion-spinner>'
    });

    $scope.newTableData._user = JSON.parse(localStorage.getItem('userData')).user._id;
    $scope.newTableData._fromStation = $scope.newTableData._fromStation._id;
    $scope.newTableData._toStation = $scope.newTableData._toStation._id;

    $scope.newTableData.date.setHours($scope.newTableData.fromTime.getHours());
    $scope.newTableData.date.setMinutes($scope.newTableData.fromTime.getMinutes());
    $scope.newTableData.fromDatetime = angular.copy($scope.newTableData.date);

    $scope.newTableData.date.setHours($scope.newTableData.toTime.getHours());
    $scope.newTableData.date.setMinutes($scope.newTableData.toTime.getMinutes());
    $scope.newTableData.toDatetime = angular.copy($scope.newTableData.date);

    delete $scope.newTableData.fromTime;
    delete $scope.newTableData.toTime;

    tablesService.create($scope.newTableData).then(
      function(response){
        var queryString = '?_user=' + JSON.parse(localStorage.getItem(('userData'))).user._id;
        tablesService.getTables(queryString, true).then(function(response){
          $scope.tables = response;
          $ionicLoading.hide();
          $scope.closeModal();
          $scope.newTableData = {};
        })
      },
      function(reason){
        alert(reason);
        $scope.modal.hide();
      });
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

})