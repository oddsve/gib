angular.module('gib.controllers', [])
.controller('IndexController',
  ['$scope', 'Github', '$location',
  function ($scope, Github, $location) {

    $scope.createBoardClicked = function () {
      $location.path("/board/" + $scope.selectedRepo.full_name);
      console.log($scope.selectedRepo);
    };

    Github.repos().then(function (repos) {
      $scope.repos = repos;
    });
}])

.controller('BoardController',
  ['$scope', 'Github',
  function ($scope, Github) {

  $scope.board = "New board";

  Github.repos().then(function (repos) {
    $scope.repos = repos;
  });
}]);

