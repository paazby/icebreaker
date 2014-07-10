app.controller('EventsCtrl', function($scope, $state, $location) {
  $scope.signIn = function() {
    $location.path('/auth/facebook');
    // $state.go('tabs.home');
  }

  $scope.events = ['club', 'bar', 'festival'];
})