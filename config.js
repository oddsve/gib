var nconf = require('nconf');

module.exports = nconf;

nconf.env('_'); // Look for config in env. Keys with : translates to _ in env variables

nconf.defaults({
  "github": {
    //
    // !!!
    //
    // You need your own Github Application for using github oauth from localhost:3000
    // https://github.com/settings/applications/new
    // - Application Name: gib-local
    // - Homepage URL: http://localhost:3000/
    // - Authorization callback URL: http://localhost:3000/auth/github/callback
    //
    // Set these environment variables before running the app:
    //   github_clientid=...
    //   github_clientsecret=...
    //
    // Or paste them in below
    //
    "clientid":     "",
    "clientsecret": ""
  }
});

if (!nconf.get('github:clientid') || !nconf.get('github:clientsecret')) {
  throw new Error("gib: Application is missing oauth clientid and clientsecret - have a look at gib's config.js for instructions on how to fix this!");
}
