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

    $scope.repoName =  $routeParams.repo;
    var userName =  $routeParams.user;


  Gib.findOrCreateBoard(userName,  $scope.repoName).then(function (board) {
    $scope.stations = board.stations;
  });

  $scope.ondrop = function (issueNumberCssId, stationIdCssId) {
    console.log(issueNumberCssId, stationIdCssId);
  };

}]);

