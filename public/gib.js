var log = console.log.bind(console);

function Gib (token, user, repo) {

  var github = new Github({ token: token });

  var gib = github.getRepo(user, repo);

  gib.listBranches(function (err, branches) {
    if (err) return console.error(err);

    if (hasGibBranch(branches)) {
      readConfig(log);
    }
    else {
      createGibBranch(function () {
        readConfig(log);
      });
    }
  });

  function readConfig (fn) {
    gib.read(Gib.BRANCH, Gib.CONFIG_FILE, function(err, data) {
      if (err) {
        gib.write(Gib.BRANCH, Gib.CONFIG_FILE, Gib.EMPTY_CONFIG, nextCommit(), function (err) {
          if (err) return console.error(err);
          fn(Gib.EMPTY_CONFIG);
        });
      }
      else {
        fn(data);
      }
    });
  }

  function hasGibBranch (branches) {
    return branches.indexOf(Gib.BRANCH) != -1;
  }

  function createGibBranch (fn) {
    gib.branch('master', Gib.BRANCH, function (err, branch) {
      if (err) return console.error(err);
      fn(branch);
    });
  }

  function nextCommit() {
    return "Update " + new Date();
  }
}

Gib.BRANCH = 'gib';
Gib.CONFIG_FILE = '.gib';
Gib.EMPTY_CONFIG = JSON.stringify({
  version: '0.0.1',
  stations: ['backlog', 'in progress', 'done']
});
