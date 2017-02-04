# generator-jhipster-mssql
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> JHipster module for adding Microsoft SQL capabilities to a generated application.

# PLEASE NOTE

As of JHipster v3.12.1, MSSQL is an official choice in the generator!  Please use this module only if you are building 
a project with an older version (<= v3.12.0).

# Introduction

This is a [JHipster](http://jhipster.github.io/) module, that is meant to be used in a JHipster application.

# Prerequisites

As this is a [JHipster](http://jhipster.github.io/) module, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://jhipster.github.io/installation.html)

##### This modules requires JHipster >= v3.0.0.  If you want to use a lower version, please use v1.0.1 of this module.

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
2. Make sure your IP and your production environment's IP are in the Allowed IPs for the MSSQL Database.

A docker-compose configuration is generated for you in `src/main/docker`.  Run `docker-compose -f src/main/docker/mssql.yml up -d` in order to launch a local SQL Server.  Running this image requires docker
to have more than 3.25GB of RAM.

# Notes

This was tested with an Azure-hosted MSSQL database and initial JHipster database settings of MySQL. 

You will need to manually add date and autoincrement properties to Liquibase changelogs for any generated entities (copy from the initial changelog).  This will change in the next version.

# License

Apache-2.0 © [Jonathan Ruddell]

[npm-image]: https://img.shields.io/npm/v/generator-jhipster-mssql.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-mssql
[travis-image]: https://travis-ci.org/ruddell/generator-jhipster-mssql.svg?branch=master
[travis-url]: https://travis-ci.org/ruddell/generator-jhipster-mssql
[daviddm-image]: https://david-dm.org/ruddell/generator-jhipster-mssql.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ruddell/generator-jhipster-module
