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

      $scope.ondrop = function () {
        var boardClone = JSON.parse(JSON.stringify(board));

        boardClone.stations.forEach (function(station){
          var stationItem = document.getElementById("station-" + station.id);
          var issues = Array.prototype.slice.call(stationItem.getElementsByTagName("li"));
          station.issues = [];
          issues.forEach(function(el){
            var issueId = JSON.parse(el.getAttribute("data-json")).issueId;
            if ( issueId != 0 ){
              station.issues.push({"id" : issueId});
            }
          });
        });

        Gib.saveBoard(user, repo, boardClone);
      };

    });
}]);

