/*
 * angular-marked - v0.0.8 
 * (c) 2014 J. Harshbarger
 * Licensed MIT
 */

/* jshint undef: true, unused: true */
/* global angular:true */
/* global window:true */

(function () {
	'use strict';

  var app = angular.module('hc.marked', []);

  app.constant('marked', window.marked);

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
        set(value);

        function set(val) {
        	element.html(marked(val || '', scope.opts || null));
        }
        
        if (attrs.marked) {
          scope.$watch('marked', set);        	
        }

      }
    };
  }]);

}());