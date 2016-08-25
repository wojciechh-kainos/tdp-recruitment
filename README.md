TDP Recruitment
===============

A simple application to support interviews scheduling.

## Dependencies

Software you'll need installed:
- JDK 8
- PostgreSQL 9.4
- Node.js (was developed against 6.3, but can quite probably run with an older version)
- Gradle >= 2.0 (required for [Jenkins pipeline](https://jenkins.io/doc/pipeline/), local project can be handled using the provided wrapper)

For local development the database server is required to be running on default PostgreSQL port **5432** and have a a **tdprecruitment** database owned by **tdp** user identified by password **tdp**. These are the defaults configured in [app_config.yml](src/main/resources/app_config.yml)

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
