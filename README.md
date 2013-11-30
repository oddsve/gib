gib
=========

### dependencies

- node.js >= 0.10
- nodemon


    npm install -g nodemon

### setup

Create a file called `run`.

Put this inside it

    github_clientid= \
    github_clientsecret= \
    nodemon server.js
    
Then do `chmod u+x run`

### run

    npm install
    ./run

### deploy

    git remote add heroku git@heroku.com:getgib.git
    git push heroku master
