# generator-jhipster-mssql
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> JHipster module for adding Microsoft SQL capabilities to a generated application.

# Introduction

This is a [JHipster](http://jhipster.github.io/) module, that is meant to be used in a JHipster application.

# Prerequisites

As this is a [JHipster](http://jhipster.github.io/) module, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://jhipster.github.io/installation.html)

##### This modules requires JHipster >= v2.27.0

# Installation

To install this module:

```bash
npm install -g generator-jhipster-mssql
```

To update this module:
```bash
npm update -g generator-jhipster-mssql
```

# Usage

To enable MSSQL for your project:

```bash
yo jhipster-mssql
```
### Follow These Steps
1. Add your MSSQL Database Credentials in the application-dev.yml and application-prod.yml files.  Simply copying an Azure Connection String (JDBC) and setting your username/password will work.
2. Add your IP and your production environment's IP to the Allowed IPs for the MSSQL Database.
3. Install the MSSQL-JDBC Driver locally and on any mvn repositories your project builds off of (important for corporate environments).  
  1. Download from: [https://www.microsoft.com/en-us/download/details.aspx?id=11774](https://www.microsoft.com/en-us/download/details.aspx?id=11774)
  2. Run to install locally:
```bash
mvn install:install-file -Dfile=path/to/sqljdbc42.jar -DgroupId=com.microsoft.sqlserver -DartifactId=sqljdbc42 -Dversion=4.2 -Dpackaging=jar
```

# Notes

This is an initial release so there will be untested situations.  This was tested with an Azure-hosted MSSQL database and initial database settings of MySQL. 

You will need to manually add date and autoincrement properties to Liquibase changelogs for any generated entities (copy from the initial changelog).  This will change in the next version.

# License

Apache-2.0 © [Jonathan Ruddell]

[npm-image]: https://img.shields.io/npm/v/generator-jhipster-mssql.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-mssql
[travis-image]: https://travis-ci.org/ruddell/generator-jhipster-mssql.svg?branch=master
[travis-url]: https://travis-ci.org/ruddell/generator-jhipster-mssql
[daviddm-image]: https://david-dm.org/ruddell/generator-jhipster-mssql.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ruddell/generator-jhipster-module
