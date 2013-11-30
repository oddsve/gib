var nconf = require('nconf');

module.exports = nconf;

nconf.env('_'); // Look for config in env. Keys with : translates to _ in env variables

nconf.defaults({
  "github": {
    "clientid":     "",
    "clientsecret": ""
  }
});

if (!nconf.get('github:clientid') || !nconf.get('github:clientsecret')) {
  throw new Error("gib: Application is missing oauth clientid and clientsecret - see README.md on how to set up a dummy Github Application for using on localhost.");
}
