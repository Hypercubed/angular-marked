'use strict';

// TODO: test options
// TODO: test ng-include
// TODO: test marked.setOptions

describe('Directive: marked,', function () {

  // load the directive's module
  beforeEach(module('hc.marked'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $templateCache) {

    scope = $rootScope.$new();
    scope.markdown = "## Scope";
    scope.file = './README.md';

    $templateCache.put(scope.file, 'TEST');
  }));

  describe('Element,', function () {
    it('should convert markdown', inject(function ($compile) {
      element = angular.element('<marked>## Element</marked>');
      element = $compile(element)(scope);
      expect(element.html()).toBe('<h2 id="element">Element</h2>\n');
    }));
  });

  describe('Attribute,', function () {
    it('should convert markdown', inject(function ($compile) {
      element = angular.element('<div marked>## Attribute</div>');
      element = $compile(element)(scope);
      expect(element.html()).toBe('<h2 id="attribute">Attribute</h2>\n');
    }));

    it('should convert markdown from scope', inject(function ($compile) {
      element = angular.element('<div marked="markdown"></div>');
      element = $compile(element)(scope);
      expect(element.html()).toBe('<h2 id="scope">Scope</h2>\n');
    }));

    it('should convert markdown from string', inject(function ($compile) {
      element = angular.element('<div marked="\'## String\'"></div>');
      element = $compile(element)(scope);
      expect(element.html()).toBe('<h2 id="string">String</h2>\n');
    }));
  });

  /* describe('Include', function () {
    it('should convert markdown', inject(function ($compile) {
      element = angular.element('<div marked ng-include="file"></div>');
      element = $compile(element)(scope);
      console.log(element);
      expect(element.html()).toBe('');
    }));
  }); */

});
