angular.module('gib.services', [])

.service('Github',
  ['$q', '$rootScope', 'token',
  function ($q, $rootScope, token) {

  var github = new Github({ token: token });

  function resolver (d, data) {
    return function (err, response) {
      if (err) d.reject(err);
      else d.resolve(data || response);
    };
  }

  function repo (user, repo) {
    return github.getRepo(user, repo);
  }

  function repos () {
    var d = $q.defer();
    var user = github.getUser();
    user.repos(resolver(d));
    return d.promise;
  }

  function branches (repo) {
    console.log('list branches');
    var d = $q.defer();
    repo.listBranches(resolver(d));
    return d.promise;
  }

  function createBranch (repo, branch) {
    console.log('create branch');
    var d = $q.defer();
    repo.branch('master', branch, resolver(d));
    return d.promise;
  }

  function read (repo, branch, file) {
    var d = $q.defer();
    repo.read(branch, file, resolver(d));
    return d.promise;
  }

  function write (repo, branch, file, content, msg) {
    var d = $q.defer();
    repo.write(branch, file, content, msg, resolver(d, content));
    return d.promise;
  }

  function issues () {
    // todo list all issues
  }

  return {
    repo: repo,
    repos: repos,
    branches: branches,
    createBranch: createBranch,
    read: read,
    write: write,
    issues: issues
  };
}])

.service('Gib',
  ['$q', '$rootScope', 'Github',
  function ($q, $rootScope, Github) {

    var BRANCH = 'gib';

    var CONFIG_FILE = '.gib';

    var EMPTY_CONFIG_FILE = JSON.stringify({
      version: '0.0.1',
      stations: ['backlog', 'in progress', 'done']
    });

    function createBoard (user, repo) {
      console.log('create board');
      var d = $q.defer();

      var repo = Github.repo(user, repo);

      Github
        .branches(repo)
        .then(findOrCreateGibBranch(repo))
        .then(readOrCreateConfig(repo))
        .then(parseStringToJson)
        .then(d.resolve)
        .catch(d.reject);

      return d.promise;
    }

    function findOrCreateGibBranch (repo) {

      return function (branches) {
        console.log('find or create branch');
        var d = $q.defer();

        if (hasGibBranch(branches)) {
          d.resolve(BRANCH);
        }
        else {
          Github
            .createBranch(repo, BRANCH)
            .then(d.resolve)
            .catch(d.reject);
        }

        return d.promise;
      }
    }

    function readOrCreateConfig (repo) {

      return function () {
        console.log('read config file');
        var d = $q.defer();

        Github
          .read(repo, BRANCH, CONFIG_FILE)
          .then(d.resolve)
          .catch(function () {

            createConfig(repo)
              .then(d.resolve)
              .catch(d.reject);
          });

        return d.promise;
      }
    }

    function parseStringToJson (data) {
      var d = $q.defer();
      try {
        d.resolve(JSON.parse(data));
      }
      catch (e) {
        d.reject(e);
      }
      return d.promise;
    }

    function createConfig (repo) {
      console.log('create config file');
      var d = $q.defer();

      Github
        .write(repo, BRANCH, CONFIG_FILE, EMPTY_CONFIG_FILE, nextCommit())
        .then(d.resolve)
        .catch(d.reject);

      return d.promise;
    }

    function hasGibBranch (branches) {
      return branches.indexOf(Gib.BRANCH) != -1;
    }

    function nextCommit() {
      return "Update " + new Date();
    }

    return {
      createBoard: createBoard
    };

}]);
