var app = angular.module('gib', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {

  $routeProvider

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

app.controller('IndexController', [function () {
  console.log('index');
}]);

app.controller('NowController', ['$scope', function ($scope) {
  $scope.now = new Date();
}]);

