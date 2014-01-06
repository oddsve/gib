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

  function issues (user, repo) {
    return github.getIssues(user, repo);
  }

  function repos () {
    var d = $q.defer();
    var user = github.getUser();
    user.repos(resolver(d));
    return d.promise;
  }

  function organizations() {
    var d = $q.defer();
    var user = github.getUser();
    user.orgs(resolver(d));
    return d.promise;
  }

  function orgRepos(orgName){
    var d = $q.defer();
    var user = github.getUser();
    user.orgRepos(orgName, resolver(d));
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

  function listIssues (user, repo) {
    var d = $q.defer();
    issues(user, repo)
      .list({}, resolver(d));
    return d.promise;
  }

  return {
    repo: repo,
    repos: repos,
    orgRepos: orgRepos,
    organizations: organizations,
    branches: branches,
    createBranch: createBranch,
    read: read,
    write: write,
    issues: listIssues
  };
}])

.service('Gib',
  ['$q', '$rootScope', 'Github',
  function ($q, $rootScope, Github) {

    var BRANCH = 'gib';

    var CONFIG_FILE = '.gib';

    var EMPTY_CONFIG_FILE = JSON.stringify({
      version: '0.0.1',
      stations: [
        { issues: [], id: 0, name: 'backlog' },
        { issues: [], id: 1, name: 'in progress' },
        { issues: [], id: 2, name: 'done' }
      ]
    });

    function findOrCreateBoard (user, repository) {
      console.log('create board');
      var d = $q.defer();

      var repo = Github.repo(user, repository);

      var configPromise =
        Github
          .branches(repo)
          .then(findOrCreateGibBranch(repo))
          .then(readOrCreateConfig(repo))
          .then(parseConfigStringToObject);

      var issuesPromise =
        Github
          .issues(user, repository);

      $q.all([
          configPromise,
          issuesPromise
        ])
        .then(joinConfigWithIssues)
        .then(d.resolve)
        .catch(d.reject);

      return d.promise;
    }

    function clone (obj) {
      return JSON.parse(JSON.stringify(obj));
    }

    function saveBoard (user, repository, board) {
      var d = $q.defer();

      var boardClone,
          boardJSON;
      try {
        // todo clean up
        var boardClone = clone(board);
        _.each(boardClone.stations, function (station) {
          station.issues = station.issues.map(function (issue) {
            return { id: issue.id };
          });
        });
        boardJSON = JSON.stringify(boardClone);
      }
      catch (e) {
        d.reject(e);
      }

      var repo = Github.repo(user, repository);

      Github
        .write(repo, BRANCH, CONFIG_FILE, boardJSON, nextCommit())
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

    function createConfig (repo) {
      console.log('create config file');
      var d = $q.defer();

      Github
        .write(repo, BRANCH, CONFIG_FILE, EMPTY_CONFIG_FILE, nextCommit())
        .then(d.resolve)
        .catch(d.reject);

      return d.promise;
    }

    function parseConfigStringToObject (data) {
      var d = $q.defer();
      try {
        d.resolve(JSON.parse(data));
      }
      catch (e) {
        d.reject(e);
      }
      return d.promise;
    }

    function joinConfigWithIssues (configAndIssues) {
      var config = configAndIssues[0];
      var issues = configAndIssues[1];

      // keep issues by id
      var issuesById = {};
      _.each(issues, function (issue) {
        issuesById[issue.id] = issue;
      });

      // remember what issues occur in stations
      var issuesInStations = [];
      _.each(config.stations, function (station) {

        var updatedIssuesForStation = [];
        _.each(station.issues, function (issue) {
          issuesInStations.push(issue.id);

          // update all stations' issues with content from github
          updatedIssuesForStation.push(issuesById[issue.id]);
        });

        station.issues = updatedIssuesForStation;
      });

      var backlog = config.stations[0];
      backlog.issues = backlog.issues.concat(_.filter(issues, function (issue) {
        return issuesInStations.indexOf(issue.id) == -1;
      }));

      return config;
    }

    function hasGibBranch (branches) {
      return branches.indexOf(BRANCH) != -1;
    }

    function nextCommit() {
      return "Update " + new Date();
    }

    return {
      findOrCreateBoard: findOrCreateBoard,
      saveBoard: saveBoard
    };

}]);
