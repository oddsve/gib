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
  ['$scope', 'Gib', '$routeParams',
  function ($scope, Gib, $routeParams) {

  //$scope.stations = [
    //{"name":"Produktkø", "issues":[{"title":"Feil 1"},{"title":"Bug l2"}]},
    //{"name":"I arbeid" ,"issues":[{"title":"tull 3"},{"title":"bug 4"}]},
    //{"name":"Ferdig", "issues":[{"title":"Feil 5"},{"title":"bug 6"}]}
  //]
  //
  $scope.repo =  $routeParams.repo;

  Gib.createBoard('oddsve', 'gib').then(function (board) {
    board = JSON.parse(board);
    $scope.stations = board.stations.map(function (station) {
      return { name: station };
    });
  });

}]);

