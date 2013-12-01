angular.module('gib.controllers', [])

.controller('IndexController',
  ['$scope', 'Github', '$location',
  function ($scope, Github, $location) {

    $scope.createBoardClicked = function () {
      $location.path("/board/" + $scope.selectedRepo.full_name);
    };

    Github.repos().then(function (repos) {
      $scope.repos = repos;
    });
}])

.controller('BoardController',
  ['$scope', 'Gib', '$routeParams',
  function ($scope, Gib, $routeParams) {

  $scope.repo =  $routeParams.repo;

  Gib.findOrCreateBoard('oddsve', 'gib').then(function (board) {
    $scope.stations = board.stations;
  });

}]);

