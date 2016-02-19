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

    if(this.message == 'Y' && (this.dev || this.prod)){
    //    Check for MS SQL Server JDBC in pom and add it if missing
      jhipsterFunc.addMavenDependency('com.microsoft.sqlserver','sqljdbc41','4.1');
      jhipsterFunc.addMavenDependency('com.github.sabomichal','liquibase-mssql','1.4');

    }

    done();
  },

  install: function () {
    var done = this.async();
    done();
  },

  end: function () {
  }
});
