/*
 * angular-marked v0.0.1
 * (c) 2013 J. Harshbarger
 * License: MIT
 */

/* jshint undef: true, unused: true */
/* global angular:true */
/* global marked:true */

(function () {
	'use strict';

  var app = angular.module('hc.marked', []);

  app.constant('marked', marked);

  // Maybe this is better?
  //app.service('marked', ['$window', function($window) {
  //	return $window.marked;
  //}]);

  // TODO: filter tests */
  //app.filter('marked', ['marked', function(marked) {
	//  return marked;
	//}]);

  app.directive('marked', ['marked', function (marked) {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        opts: '=',
        marked: '='
      },
      link: function (scope, element, attrs) {
        var value = scope.marked || element.text() || '';
        element.html(marked(value, scope.opts || null));

        if (attrs.marked)
          scope.$watch('marked', function(value) {
            element.html(marked(value || '', scope.opts || null));
          });

      }
    };
  }]);

}());