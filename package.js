// package metadata file for Meteor.js
var packageName = 'oshai:angular-marked';
var where = 'client'; // where to install: 'client' or 'server'. For both, pass nothing.
var version = '0.0.14';
var summary = 'AngularJS Markdown using marked.';
var gitLink = 'https://github.com/oshai/angular-marked';
var documentationFile = 'README.md';

// Meta-data
Package.describe({
  name: packageName,
  version: version,
  summary: summary,
  git: gitLink,
  documentation: documentationFile
});

Package.onUse(function(api) {
  api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0']); // Meteor versions

  api.use('chuangbo:marked@0.3.3', where); // Dependencies

  api.addFiles('angular-marked.js', where); // Files in use
  
 }); 