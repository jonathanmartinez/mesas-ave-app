//Manages all the logic for the specific table of the user in session
.controller('myTableCtrl', function($ionicModal, $ionicLoading, $scope, $stateParams, $rootScope, tablesService, stationsService, $state) {
  $scope.table = tablesService.getTable($stateParams.tableId, true);
  $scope.stations = stationsService.stations;

  $ionicModal.fromTemplateUrl('templates/editMyTableModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })

  $scope.openModal = function() {
    $scope.editMyTableData = angular.copy($scope.table);

    $scope.editMyTableData.date = new Date($scope.editMyTableData.fromDatetime);
    $scope.editMyTableData.fromTime = new Date($scope.editMyTableData.fromDatetime);
    $scope.editMyTableData.toTime = new Date($scope.editMyTableData.toDatetime);

    angular.forEach($scope.stations, function(station, i){
      if($scope.editMyTableData._fromStation._id == station._id){
        $scope.editMyTableData._fromStation = station;
      }
      if($scope.editMyTableData._toStation._id == station._id){
        $scope.editMyTableData._toStation = station;
      }
    })

    $scope.modal.show()
  }

  //Updates an existing Table if it belongs to the user in session.
  $scope.editMyTable = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="ripple" style="stroke:white;fill;white"></ion-spinner>'
    });

    $scope.editMyTableData._fromStation = $scope.editMyTableData._fromStation._id;
    $scope.editMyTableData._toStation = $scope.editMyTableData._toStation._id;
    $scope.editMyTableData._user = $scope.editMyTableData._user._id;

    $scope.editMyTableData.date.setHours($scope.editMyTableData.fromTime.getHours());
    $scope.editMyTableData.date.setMinutes($scope.editMyTableData.fromTime.getMinutes());
    $scope.editMyTableData.fromDatetime = angular.copy($scope.editMyTableData.date);
    $scope.editMyTableData.date.setHours($scope.editMyTableData.toTime.getHours());
    $scope.editMyTableData.date.setMinutes($scope.editMyTableData.toTime.getMinutes());
    $scope.editMyTableData.toDatetime = $scope.editMyTableData.date;


    tablesService.update($scope.editMyTableData).then(
      function(response){
        var queryString = '?_user=' + JSON.parse(localStorage.getItem(('userData'))).user._id;
        tablesService.getTables(queryString, true).then(function(response){
          $scope.table = tablesService.getTable($stateParams.tableId);
          $ionicLoading.hide();
          $scope.closeModal();
        })
      },
      function(reason){
        alert(reason);
      });
  }

  //Deletes an existing Table if it belongs to the user in session.
  $scope.deleteMyTable = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="ripple" style="stroke:white;fill;white"></ion-spinner>'
    });

    tablesService.delete($stateParams.tableId).then(
      function(response){
        var queryString = '?_user=' + JSON.parse(localStorage.getItem(('userData'))).user._id;
        tablesService.getTables(queryString, true).then(function(response){
          $ionicLoading.hide();
          $scope.closeModal();
          $state.go('app.myTables')
        })
      },
      function(reason){
        alert(reason);
      });
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
});