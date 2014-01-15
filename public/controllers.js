angular.module('gib.controllers', [ 'ngDialog' ])

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
  ['$scope', 'Gib', '$routeParams', 'ngDialog',
  function ($scope, Gib, $routeParams, ngDialog) {

    var repo = $scope.repoName = $routeParams.repo;
    var user = $routeParams.user;

    $scope.onCloseClick = function(){
      $scope.selectedIssue = null;
    }

    $scope.onClick = function(issue){
      $scope.selectedIssue = issue;
      ngDialog.open({
        template: 'partials/issue-popup.html',
        className: 'selected-issue ngdialog-theme-default',
        scope: $scope
      });
    }

    Gib.findOrCreateBoard(user, repo)
       .then(function (board) {

      $scope.stations = board.stations;


      $scope.ondrop = function (droppedIssue, toStation) {
        var boardClone = JSON.parse(JSON.stringify(board));
        var message;

        if (toStation.stationId == droppedIssue.stationId){
          message = ":arrows_counterclockwise: " + toStation.name + " is  reprioritized.";
        } else {
            var direction;
            if (toStation.stationId > droppedIssue.stationId){
              direction = ":arrow_right:";
            } else {
              direction = ":arrow_left:";
            }

          message = direction + " Issue number " + droppedIssue.number + " moved to " + toStation.name;
        }


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

        Gib.saveBoard(user, repo, boardClone, message);
      };

    });
}]);

