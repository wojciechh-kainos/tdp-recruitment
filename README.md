TDP Recruitment
===============

A simple application to support interviews scheduling.

## Dependencies

- Java 8
- PostgreSQL 9.4
- Node.js (was developed against 6.3, but can quite probably run with an older version)
- Gradle >= 2.0 (required for Jenkins pipeline, local project can be handled using the provided wrapper)

## Usage and maintenance essentials

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
