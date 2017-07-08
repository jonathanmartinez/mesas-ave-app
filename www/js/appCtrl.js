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