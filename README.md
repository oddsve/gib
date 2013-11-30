gib [![Build Status](https://travis-ci.org/oddsve/gib.png?branch=master)](https://travis-ci.org/oddsve/gib)
=========

### dependencies

- node.js >= 0.10
- nodemon

Install nodemon like this

    npm install -g nodemon

### setup

Create a file called `run`.

You need your own Github Application for using github oauth from localhost

Go to https://github.com/settings/applications/new

Create a new application with the following settings

- Application Name: gib-local
- Homepage URL: http://localhost:3000/
- Authorization callback URL: http://localhost:3000/auth/github/callback

Set the client id and the client secret as environment variables in your `run` file

    github_clientid=CLIENT_ID_HERE \
    github_clientsecret=CLIENT_SECRET_HERE\
    nodemon server.js

Then do `chmod u+x run`

### run

    npm install
    ./run

### deploy

    git remote add heroku git@heroku.com:getgib.git
    git push heroku master
