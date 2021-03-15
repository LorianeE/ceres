# Cérès
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

A webapp to create and manage your shopping list based on what you have in your store and what you want to cook
in your menu !

## Prerequisite

* [nvm](https://github.com/creationix/nvm)
* [Node.js](https://nodejs.org)
* [Yarn](https://yarnpkg.com/)
* [Docker](https://docs.docker.com/install/#supported-platforms)
* [Docker-Compose](https://docs.docker.com/compose/install)
* [Mongo](https://www.mongodb.com/cloud/atlas/lp/general/try?jmp=search&utm_source=google&utm_campaign=GS_EMEA_France_Search_Brand_Atlas_Desktop&utm_term=mongoose%20db&utm_device=c&utm_network=g&utm_medium=cpc_paid_search&utm_matchtype=e&utm_cid=1718986507&utm_asagid=66929792586&utm_adid=335279326559&gclid=CjwKCAjwmZbpBRAGEiwADrmVXq_2s6PG9-0ZS7WPKrPimFgxC9es_lMXgkRVS00F6RzggCNFgoCIiRoCNj4QAvD_BwE)

Install node and yarn:
```
# nvm
nvm install v14.16.0
nvm alias default v14.16.0
nvm use default

# ensure npm is at its latest version
npm i -g npm

#yarn
npm install -g yarn
```

> Note: Behind the scene, this monorepo is built with lerna and yarn workspaces

> Note: CI and deployment are done with GitHub Actions

## Frameworks

* [Ts.ED](https://tsed.io/),
* [TypeScript](https://www.typescriptlang.org/),
* [React](https://fr.reactjs.org/)
* [Redux](https://redux.js.org/)
* [Swagger](http://swagger.io/)
* [Lerna](https://lerna.js.org/)
* [Babel](https://babeljs.io/)
* [Webpack](https://webpack.js.org/)

## Run in Development

**To run the app, you will need .env files for both client and server. You should ask for them to @LorianeE.**

Run these commands to start application:
```sh
# start mongodb
docker-compose up mongo

# start server on http://localhost:8083
yarn start:server

# start app on http://localhost:3000
yarn start:client
```

Then open this url in your browser: [http://localhost:3000/](http://localhost:3000/)

## Build docker image

Run these commands:
```
yarn docker:build
docker-compose up
```

Then open this url in your browser: [http://localhost:8083/](http://localhost:8083/)

## Connect to application

You will need a Facebook account to log in, and to be in authorized users for this app to test it. Contact @LorianeE to get access.

## Deploy on Heroku
### Production

Just merge a pull request on `master` branch. GitHub Actions will deploy automatically the branch on Heroku.
To see the result : http://ceres-webapp.herokuapp.com
