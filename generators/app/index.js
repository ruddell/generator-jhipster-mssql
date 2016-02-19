'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var packagejs = require(__dirname + '/../../package.json');

// Stores JHipster variables
var jhipsterVar = {moduleName: 'mssql'};

// Stores JHipster functions
var jhipsterFunc = {};

module.exports = yeoman.generators.Base.extend({

  initializing: {
    templates: function (args) {
      this.composeWith('jhipster:modules', {
        options: {
          jhipsterVar: jhipsterVar,
          jhipsterFunc: jhipsterFunc
        }
      });
    },
    displayLogo: function () {
      // Have Yeoman greet the user.
      this.log(yosay(
        'Welcome to the ' + chalk.red('JHipster mssql') + ' generator! ' + chalk.yellow('v' + packagejs.version)
      ));
    }
  },

  prompting: function () {
    var done = this.async();

    var prompts = [
      {
        type: 'input',
        name: 'message',
        message: 'Enable MS-SQL support in your JHipster app? (Y/n)',
        default: 'Y'
      },
      {
        type: 'input',
        name: 'dev',
        message: 'Enable for Dev? (Y/n)',
        default: 'Y'
      },
      {
        type: 'input',
        name: 'prod',
        message: 'Enable for Prod? (Y/n)',
        default: 'Y'
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: function () {
    var done = this.async();

    this.baseName = jhipsterVar.baseName;
    this.packageName = jhipsterVar.packageName;
    this.angularAppName = jhipsterVar.angularAppName;
    this.javaDir = jhipsterVar.javaDir;
    this.resourceDir = jhipsterVar.resourceDir;
    this.webappDir = jhipsterVar.webappDir;
    this.message = this.props.message.toUpperCase();
    this.prod = this.props.prod.toUpperCase();
    this.dev = this.props.dev.toUpperCase();

    this.changelogHeader = '<databaseChangeLog' +
                            '\n    xmlns="http://www.liquibase.org/xml/ns/dbchangelog"' +
                            '\n    xmlns:ext="http://www.liquibase.org/xml/ns/dbchangelog-ext"' +
                            '\n    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
                            '\n    xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.4.xsd' +
                            '\n    http://www.liquibase.org/xml/ns/dbchangelog-ext http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-ext.xsd">';

    this.changelogLoadData = '<ext:loadData encoding="UTF-8"' +
                    '\n                  file="config/liquibase/users.csv"' +
                    '\n                  separator=";"' +
                    '\n                  tableName="jhi_user"' +
                    '\n                  identityInsertEnabled="true">'+
                    '\n            <column name="activated" type="boolean"/>' +
                    '\n            <column name="created_date" type="timestamp"/>' +
                    '\n        </ext:loadData>' +
                    '\n        <dropDefaultValue tableName="jhi_user" columnName="created_date" columnDataType="datetime"/>' +
                    '\n' +
                    '\n        <ext:loadData encoding="UTF-8"' +
                    '\n                  file="config/liquibase/authorities.csv"' +
                    '\n                  separator=";"' +
                    '\n                  tableName="jhi_authority"' +
                    '\n                  identityInsertEnabled="true" />'+
                    '\n' +
                    '\n        <ext:loadData encoding="UTF-8"' +
                    '\n                  file="config/liquibase/users_authorities.csv"' +
                    '\n                  separator=";"' +
                    '\n                  tableName="jhi_user_authority"' +
                    '\n                  identityInsertEnabled="true" />';

    if(this.message == 'Y' && (this.dev || this.prod)){
    //    Check for MS SQL Server JDBC in pom and add it if missing
      jhipsterFunc.addMavenDependency('com.microsoft.sqlserver','sqljdbc41','4.1');
      jhipsterFunc.addMavenDependency('com.github.sabomichal','liquibase-mssql','1.4');

    //  Add ext to databaseChangeLog XML schema in 00000000000000_initial_schema.xml
      jhipsterFunc.replaceContent(this.resourceDir + 'config/liquibase/changelog/00000000000000_initial_schema.xml', '<databaseChangeLog[\\s\\S]*3.4.xsd">', this.changelogHeader, true);

    //  Add ext prefix and identityInsertEnabled="true" attribute to loadData
      jhipsterFunc.replaceContent(this.resourceDir + 'config/liquibase/changelog/00000000000000_initial_schema.xml', '<loadData[\\s\\S]*authority"/>', this.changelogLoadData, true);
    }

    done();
  },

  install: function () {
    var done = this.async();
    done();
  },

  end: function () {
    this.log('You will need to install the sqljdbc41.jar locally.');
    this.log('Download link:\nhttps://www.microsoft.com/en-us/download/details.aspx?id=11774');
    this.log('Command to install:\nmvn install:install-file -Dfile=path/to/sqljdbc41.jar -DgroupId=com.microsoft.sqlserver -DartifactId=sqljdbc41 -Dversion=4.1 -Dpackaging=jar');
    this.log('If you use a corporate mvn repository, you need to install the sqljdbc41.jar onto that repository');
  }
});
