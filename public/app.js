var app = angular.module('gib', [
  'ngRoute',
  'gib.services',
  'gib.controllers'
]);

app.value('token', localStorage.getItem('token'));

app.config(function ($routeProvider, $locationProvider) {

  $routeProvider

    .when('/', {
      controller: 'IndexController',
      templateUrl: 'partials/index.html'
    })

    .when('/board/:user/:repo', {
        controller: 'BoardController',
        templateUrl: 'partials/board.html'
    })

    .otherwise({
      redirectTo: '/'
    });
});
