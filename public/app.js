var app = angular.module('gib', ['ngRoute']);
app.value('token', localStorage.getItem('token'));
app.config(function ($routeProvider, $locationProvider) {

  $routeProvider

    .when('/token/:token', {
      controller: 'InstallController',
      templateUrl: 'partials/index.html'
    })

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
}]);

app.controller('NowController', ['$scope', function ($scope) {
  $scope.now = new Date();
}]);

app.service('Github',
  ['$q', 'token',
  function ($q, token) {

  var github = new Github({ token: token });

  function repos () {
    var d = $q.defer();

    var user = github.getUser();
    user.repos(function (err, repos) {
      if (err) d.reject(err);
      else d.resolve(repos);
    });

    return d.promise;
  }

  return {
    repos: repos
  }
}]);

