/*
 * angular-marked v0.0.1
 * (c) 2013 J. Harshbarger
 * License: MIT
 */

/*

 TODO: tests:
  
   <marked>##TEXT 1</marked>
   <div marked>##TEXT 2</div>
   <div ng-init="scope_element = '##TEST 4'"><div marked="scope_element"></div></div>
   <div marked="'##TEXT 3'"></div>
   <div marked opts="{gfm: true}"></div>
   <div marked ng-include="'filename.md'"></div>
  
*/

(function () {

  var app = angular.module('hc.marked', []);

  app.constant('marked', marked);

  //TODO: filter

  app.directive("marked", ['$http', 'marked', function ($http, marked) {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        opts: '=',
        marked: '='
      },
      link: function (scope, element, attrs) {

        if (attrs.marked) {
          scope.$watch('marked', function(value) {
            element.html(marked(value || '', scope.opts || null));
          });
        } else {
          element.html(marked(element.text(), scope.opts || null));
        }

      }
    };
  }]);

}());