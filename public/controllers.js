angular.module('gib.controllers', [])

.controller('IndexController',
  ['$scope', 'Github', '$location',
  function ($scope, Github, $location) {

    $scope.createBoardClicked = function () {
      $location.path("/board/" + $scope.selectedRepo.full_name);
    };

    $scope.organizationChanged = function () {
      var promise;
      if ($scope.selectedOrganization) {
        promise = Github.orgRepos($scope.selectedOrganization.login);
      } else {
        promise = Github.repos();
      }

      promise.then(function (repos) {
        $scope.repos = repos;
      });

    };

    Github.repos().then(function (repos) {
      $scope.repos = repos;
    });

    Github.organizations().then(function (organizations){
      $scope.organizations = organizations;
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
          var issues = document.querySelectorAll("#station-" + station.id + " .issue");
          issues = Array.prototype.slice.call(issues);
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

