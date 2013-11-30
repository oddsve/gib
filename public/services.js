angular.module('gib.services', [])

.service('Github',
  ['$q', '$rootScope', 'token',
  function ($q, $rootScope, token) {

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

