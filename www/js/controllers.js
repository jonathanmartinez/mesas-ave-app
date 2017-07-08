/*
####################################################################################
IMPORTANT: this file is deprecated. Now all the controllers are in their -Ctrl.js file
####################################################################################
*/
angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout, $ionicHistory, $ionicLoading, $state, loginService, stationsService, usersService) {
  $scope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
    if (toState.module == 'private' && !loginService.isLogged()) {
      // If logged out and transitioning to a logged in page:
      //save the next state for continue navigating if user log in
      $rootScope.toState = toState;
      //prevent continue to private view
      event.preventDefault();
      $scope.login();

    }

    if(toState.resolve){
      $ionicLoading.show({
      template: '<ion-spinner icon="ripple" style="stroke:white;fill;white"></ion-spinner>'
    });
    }

  });

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $scope.currentStateName = $ionicHistory.currentStateName();
    $timeout(function(){
      $ionicLoading.hide()
    },500);
  });

  //reference
  $rootScope.user = loginService.user;
  if(Object.keys($rootScope.user.data).length == 0){
    loginService.user.data = JSON.parse(localStorage.getItem('userData'));
  }

  // Form data for the login modal
  $scope.loginData = {};

  $scope.signinData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.customTitle = 'Login'
  $scope.loginOrSignin = function(flag){
    if (flag == 'login'){
      $scope.flag = false;
      $scope.customTitle = 'Login';
    }
    else{
      $scope.flag = true;
      $scope.customTitle = 'Crear una cuenta';
    }
  }

  $scope.signin = function(){
    $scope.closeLogin();
    $state.go('app.signin')
  }

  $scope.logout = function(){
    loginService.logout();
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('app.tables', {cache: false})
  }

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.throwEvent = function(eventName){
    $scope.$broadcast(eventName);
  }

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    loginService.login($scope.loginData.email, $scope.loginData.password).then(
      function(response){
        $scope.closeLogin();
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go($rootScope.toState.name)
      },
      function(reason){
        alert(reason);
      })
  };

  $scope.doSignin = function() {
    usersService.create($scope.signinData).then(
      function(response){
        loginService.login(response.email, response.password).then(function(){
          $scope.closeLogin();
          $state.go($rootScope.toState.name)
        })
      },
      function(reason){
        alert(reason);
      })
  };

})



.controller('tableCtrl', function(table, $scope, $stateParams) {
  $scope.table = table;
})

.controller('myAccountCtrl', function($scope, $stateParams, usersService, loginService, $ionicModal, $ionicLoading, $timeout) {
  $scope.user = loginService.user;
  $scope.editPasswordData = {_id: $scope.user._id};

  $ionicModal.fromTemplateUrl('templates/editUserModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })

  $scope.openModal = function() {
    $scope.editUserData = angular.copy($scope.user.data.user);
    $scope.modal.show()
  }

  $scope.updateUser = function() {
    $scope.modal.hide();

    $ionicLoading.show({
      template: '<ion-spinner icon="ripple" style="stroke:white;fill;white"></ion-spinner>'
    });

    usersService.update($scope.editUserData).then(function(response){
      var userData = JSON.parse(localStorage.getItem('userData'))
      userData.user.name = response.name;
      userData.user.phone = response.phone;

      localStorage.setItem("userData", JSON.stringify(userData));

      $scope.user = JSON.parse(localStorage.getItem('userData')).user;

      $ionicLoading.hide();
    })
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
    $scope.editPasswordModal.remove();
  });

  $ionicModal.fromTemplateUrl('templates/editPasswordModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.editPasswordModal = modal
  })

  $scope.showEditPasswordModal = function() {
    $scope.editPasswordModal.show();
  }

  $scope.updatePassword = function() {
    $scope.editPasswordModal.hide();

    $ionicLoading.show({
      template: '<ion-spinner icon="ripple" style="stroke:white;fill;white"></ion-spinner>'
    });

    usersService.update($scope.editPasswordData).then(function(response){
      loginService.login(response.email, response.password).then(function(response){
        $ionicLoading.hide();
      })
    })
  }

  $scope.hideEditPasswordModal = function() {
    $scope.editPasswordModal.hide();
  };

})

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