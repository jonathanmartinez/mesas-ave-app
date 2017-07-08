//Manages the logic of Accounts within the APP
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

  //Updates an user (only himself)
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

  //Updates the password of the user in session(only himself)
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