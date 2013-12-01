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

    var repo = $scope.repoName = $routeParams.repo;
    var user = $routeParams.user;

    Gib.findOrCreateBoard(user, repo)
       .then(function (board) {

      $scope.stations = board.stations;

      $scope.ondrop = function (fromElData , toElData) {
        var stations = board.stations;

        var fromStation = _.findWhere(stations, { id: fromElData.stationId });
        var issue = _.findWhere(fromStation.issues, { id: fromElData.issueId });
        fromStation.issues = _.without(fromStation.issues, issue);

        var toStation = stations[toElData.stationId];
        toStation.issues.push(issue);

        Gib.saveBoard(user, repo, board);
      };
    });
}]);

