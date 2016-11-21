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

    this.changelogDateSettings = '<property name="now" value="GETDATE()" dbms="mssql"/>';
    this.changelogAutoIncrementSettings = '<property name="autoIncrement" value="true" dbms="mssql, mysql,h2,postgresql,oracle"/>';

    this.applicationDatasource = 'datasource:' +
                               '\n        url: jdbc:sqlserver://localhost:1433;database=' + this.baseName +
                               '\n        username: SA' +
                               '\n        password: yourStrong(!)Password' +
                               '\n    jpa:' +
                               '\n        database-platform: org.hibernate.dialect.SQLServerDialect' +
                               '\n        database: SQL_SERVER' +
                               '\n        show_sql:';

    if(this.message == 'Y' && (this.dev || this.prod)){
      //    Check for MS SQL Server JDBC in pom and add it if missing
      jhipsterFunc.addMavenDependency('com.microsoft.sqlserver','mssql-jdbc','6.1.0.jre8');
      jhipsterFunc.addMavenDependency('com.github.sabomichal','liquibase-mssql','1.5');

      //  Alter application-dev and application-prod
      if(this.dev == 'Y') {
        //  datasource[\s\S]*jpa
        jhipsterFunc.replaceContent(this.resourceDir + 'config/application-dev.yml', 'datasource[\\s\\S]*show_sql:', this.applicationDatasource, true);
      }
      if(this.prod == 'Y') {
        jhipsterFunc.replaceContent(this.resourceDir + 'config/application-prod.yml', 'datasource[\\s\\S]*show_sql:', this.applicationDatasource, true);

      }

      //  Add ext to databaseChangeLog XML schema in 00000000000000_initial_schema.xml
      jhipsterFunc.replaceContent(this.resourceDir + 'config/liquibase/changelog/00000000000000_initial_schema.xml', '<databaseChangeLog[\\s\\S]*3.4.xsd">', this.changelogHeader, true);

      //  Add settings for MSSQL Dates and Autoincrement
      jhipsterFunc.replaceContent(this.resourceDir + 'config/liquibase/changelog/00000000000000_initial_schema.xml', '<property name="now" value="current_timestamp" dbms="postgresql"/>', '<property name="now" value="current_timestamp" dbms="postgresql"/>\n    <property name="now" value="GETDATE()" dbms="mssql"/>');
      jhipsterFunc.replaceContent(this.resourceDir + 'config/liquibase/changelog/00000000000000_initial_schema.xml', '<property name="autoIncrement" value="true" dbms="mysql,h2,postgresql,oracle"/>', '<property name="autoIncrement" value="true" dbms="mssql,mysql,h2,postgresql,oracle"/>');

      //  Add ext prefix and identityInsertEnabled="true" attribute to loadData
      jhipsterFunc.replaceContent(this.resourceDir + 'config/liquibase/changelog/00000000000000_initial_schema.xml', '<loadData[\\s\\S]*authority"/>', this.changelogLoadData, true);

      // Add the SQL Server docker file
      this.template('mssql.yml', 'src/main/docker/mssql.yml', this, {});
    }

    done();
  },

  install: function () {
    var done = this.async();
    done();
  },

  end: function () {
    this.log('Make sure to set up your connection credentials in application-dev.yml and application-prod.yml');
  }
});
