TDP Recruitment Helper
===============

A simple application to support interviews scheduling in Kainos's Gdańsk office.

## Tech overview

The application uses [Dropwizard](http://www.dropwizard.io/) as its back-end server and [AngularJS 1](https://angularjs.org/) as the client-side solution. The database server used is [PostgreSQL](https://www.postgresql.org/), although the schema and data have been defined using [Liquibase](http://www.liquibase.org/), so theoretically it should support other relational databases as well. [Gradle](https://gradle.org/) is the build automation tool. [Node.js/NPM](https://nodejs.org) ecosystem provides convenient JavaScript dependencies management and eases testing of front-end logic.

## Dependencies

Software you'll need installed:
- JDK 8
- PostgreSQL 9.4
- Node.js (was developed against 6.3, but can quite probably run with an older version)
- Gradle >= 2.0 (required for [Jenkins pipeline](https://jenkins.io/doc/pipeline/) at the moment, local project can be handled using the provided wrapper)

For local development the database server is required to be running on default PostgreSQL port **5432** and have a a **tdprecruitment** database owned by **tdp** user identified by password **tdp**. These are the defaults configured in [app_config.yml](src/main/resources/app_config.yml).

## Running the application

After you have the dependencies installed and PostgreSQL is running, you'll need to execute database migrations to create the schema and fill it with configuration data. Then JavaScript dependencies need to be downloaded for the front-end. After that you should be good to go - just start the server and access http://localhost:8888/. See the common commands reference below for help.

## Development and maintenance essentials

### Installing Node.js's command line utilities

```
npm install
npm install -g bower
```

### Installing application's JavaScript dependencies

```
bower install
```
If you later add new dependencies or update versions of existing ones, then you can use:
```
bower update
```

### Running JavaScript tests

```
./node_modules/karma/bin/karma start karma.conf.js
```

### Running Java tests

```
./gradlew test
```

### Executing database migrations

```
./gradlew migrate
```

### Starting up a local instance

```
./graldew run
```

### Packaging the application into a releasable package

```
./gradlew fatJar
```

## About

Developed during first Gdańsk edition of [**Kainos**](https://www.kainos.pl/) **_Trainee Development Programme_**. You can read more about it [here](https://www.kainos.com/training-in-kainos/)!
