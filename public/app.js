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

    .when('/now', {
      controller:  'NowController',
      templateUrl: 'partials/now.html'
    })

    .otherwise({
      redirectTo: '/'
    });
});

app.controller('IndexController', ['token', function (token) {
  console.log(token);
}]);

app.controller('NowController', ['$scope', function ($scope) {
  $scope.now = new Date();
}]);


