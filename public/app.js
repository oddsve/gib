var app = angular.module('gib', [
  'ngRoute',
  'gib.services'
]);
app.value('token', localStorage.getItem('token'));
app.config(function ($routeProvider, $locationProvider) {

  $routeProvider

    .when('/', {
      controller: 'IndexController',
      templateUrl: 'partials/index.html'
    })

    .when('/board', {
        controller: 'BoardController',
        templateUrl: 'partials/board.html'
    })

    .when('/now', {
      controller:  'NowController',
      templateUrl: 'partials/now.html'
    })

    .otherwise({
      redirectTo: '/'
    });
});

app.controller('IndexController',
  ['$scope', 'Github', '$location',


  function ($scope, Github, $location) {



      $scope.createBoardClicked = function () {
          $location.path("/board")
      }

      Github.repos().then(function (repos) {
        $scope.repos = repos;
      });


}]);


app.controller('BoardController', ['$scope', function ($scope) {
  $scope.board = "New board";
  ['$scope', 'Github',
  function ($scope, Github) {
    Github.repos().then(function (repos) {
      $scope.repos = repos;
    });
}]);

app.controller('NowController', ['$scope', function ($scope) {
  $scope.now = new Date();
}]);

