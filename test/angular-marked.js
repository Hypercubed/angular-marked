/* global describe, beforeEach, it */
/* global expect */
/* global angular, inject */
/* global jasmine, spyOn */

describe('Provider: marked,', function () {
  'use strict';

  beforeEach(module('hc.marked'));

  it('should start with defaults', function () {
    inject(function (marked) {
      expect(marked.defaults.gfm).toBeTruthy();
      expect(marked.defaults.breaks).toBeFalsy();
      expect(marked.defaults.silent).toBeFalsy();
      expect(marked.defaults.langPrefix).toBe('lang-');
    });
  });

  it('should allow for renderers to be overwritten', function () {
    module(function (markedProvider) {
      expect(markedProvider).toBeDefined();
      markedProvider.setRenderer({
        link: function (href, title, text) {
          return '<a href="' + href + '" title="' + title + '" target="_blank">' + text + '</a>';
        }
      });
    });

    inject(function (marked) {
      var input = '[Google](http://google.com)';
      var output = marked(input);
      expect(output).toContain('target="_blank"');
    });
  });

  it('should enable changing defaults', function () {
    module(function (markedProvider) {
      expect(markedProvider).toBeDefined();
      markedProvider.setOptions({gfm: false, silent: true});
      markedProvider.setRenderer({});
    });

    inject(function (marked) {
      expect(marked.defaults.gfm).toBeFalsy();
      expect(marked.defaults.breaks).toBeFalsy();
      expect(marked.defaults.silent).toBeTruthy();
      expect(marked.defaults.langPrefix).toBe('lang-');
    });
  });
});

describe('Directive: marked,', function () {
  'use strict';

  // load the directive's module
  beforeEach(module('hc.marked'));

  var $scope;
    // $httpBackend,
  var $compile;
  var markdown;
  var html;
  var markdownCompile;
  var htmlCompileTrue;
  var htmlCompileFalse;

  beforeEach(inject(function ($rootScope, $templateCache, _$compile_) {
    $scope = $rootScope.$new();

    $scope.markdown = markdown = [
      '  # A heading',
      '',
      '  Hello *world*. Here is a [link](//hello).',
      '  And an image ![alt](http://angularjs.org/img/AngularJS-large.png).',
      '',
      '      <test>Code goes here.</test>'
    ].join('\r\n');

    html = ['<h1 id="a-heading">A heading</h1>\n<p>Hello <em>world</em>. ',
           'Here is a <a href="//hello">link</a>.\nAnd an image <img src="http://angularjs.org/img/AngularJS-large.png" alt="alt">.</p>\n',
           '<span ng-non-bindable=""><pre><code>&lt;test&gt;Code goes here.&lt;/test&gt;\n</code></pre></span>'].join('');

    $scope.file = 'file.md';

    $scope.ifValue = false;
    $scope.markdownCompile = markdownCompile = [
      '  # A heading',
      '',
      '<div ng-show="ifValue">This should be compiled</div>'
    ].join('\r\n');

    htmlCompileFalse = '<h1 id="a-heading" class="ng-scope">A heading</h1>\n<div ng-show="ifValue" class="ng-scope ng-hide">This should be compiled</div></div>';
    htmlCompileTrue = '<h1 id="a-heading" class="ng-scope">A heading</h1>\n<div ng-show="ifValue" class="ng-scope">This should be compiled</div></div>';
    $scope.fileCompile = 'file-compile.md';

    $compile = _$compile_;

    $templateCache.put($scope.file, markdown);
    $templateCache.put($scope.fileCompile, markdownCompile);
  }));

  describe('Include', function () {
    it('should convert file', function () {
      var element = $compile('<div><div marked src="file">JUNK</div></div>')($scope);
      $scope.$digest();
      expect(element.html()).toContain(html);
      expect(element.html()).not.toContain('JUNK');
    });

    it('should convert file', function () {
      var element = $compile('<div><div marked src="\'file.md\'">JUNK</div></div>')($scope);
      spyOn($scope, '$emit');
      $scope.$digest();
      expect(element.html()).toContain(html);
      expect(element.html()).not.toContain('JUNK');
    });

    it('should compile file when compile attribute is true', function () {
      $scope.ifValue = false;
      var element = $compile('<div><div marked src="\'file-compile.md\'" compile="true">JUNK</div></div>')($scope);
      $scope.$digest();
      expect(element.html()).toContain(htmlCompileFalse);
      expect(element.html()).not.toContain('JUNK');

      $scope.ifValue = true;
      $scope.$digest();
      expect(element.html()).toContain(htmlCompileTrue);
      expect(element.html()).not.toContain('JUNK');
    });

    it('should not compile file when compile attribute is false', function () {
      $scope.ifValue = false;
      var element = $compile('<div><div marked src="\'file-compile.md\'" compile="false">JUNK</div></div>')($scope);
      $scope.$digest();
      expect(element.html()).not.toContain(htmlCompileFalse);
      expect(element.html()).not.toContain('JUNK');

      $scope.ifValue = true;
      $scope.$digest();
      expect(element.html()).not.toContain(htmlCompileTrue);
      expect(element.html()).not.toContain('JUNK');
    });

    it('should emit event on error', inject(function ($httpBackend) {
      var element = $compile('<div><div marked src="\'file1.md\'">JUNK</div></div>')($scope);
      var contentErrorSpy = jasmine.createSpy('content error');
      $httpBackend.expect('GET', 'file1.md').respond(404);
      $scope.$on('$markedIncludeError', contentErrorSpy);
      $scope.$digest();
      $httpBackend.flush();
      expect(element.html()).toContain('');
    }));
  });

  describe('Element,', function () {
    it('should convert markdown', function () {
      var element = $compile('<marked>## Element</marked>')($scope);
      expect(element.html()).toContain('<h2 id="element">Element</h2>');
    });

    it('should convert markdown', function () {
      var element = $compile('<marked>**test**</marked>')($scope);
      expect(element.html()).toContain('<p><strong>test</strong></p>');
    });

    it('should convert markdown', function () {
      var element = $compile('<marked>`test`</marked>')($scope);
      expect(element.html()).toContain('<p><span ng-non-bindable=""><code>test</code></span></p>');
    });

    it('should unindent', function () {
      var element = $compile('<marked>    **test**\n    1 2 3</marked>')($scope);
      expect(element.html()).toContain('<p><strong>test</strong>\n1 2 3</p>');
    });

    it('should unindent based on shorted whitespace', function () {
      var element = $compile('<marked>    **test**\n  1 2 3</marked>')($scope);
      expect(element.html()).toContain('<p>  <strong>test</strong>\n1 2 3</p>');
    });

    it('should handle crlf', function () {
      var element = $compile('<marked>    **test**\r\n    1 2 3</marked>')($scope);
      expect(element.html()).toContain('<p><strong>test</strong>\n1 2 3</p>');
    });

    it('should not digest code blocks when compile attribute is true', function () {
      var element = angular.element('<marked compile="true">`Hello {{2 + 3}}`</marked>');
      $compile(element)($scope);
      $scope.$digest();
      expect(element.html()).toContain('<code>Hello {{2 + 3}}</code>');
    });

    it('should digest non-code blocks when compile attribute is true', function () {
      var element = angular.element('<marked compile="true">## Hello {{2 + 3}}</marked>');
      $compile(element)($scope);
      $scope.$digest();
      expect(element.html()).toContain('<h2 id="hello-2-3-" class="ng-binding ng-scope">Hello 5</h2>');
    });
  });

  describe('Attribute,', function () {
    it('should convert markdown', function () {
      var element = $compile('<div marked>## Attribute</div>')($scope);
      expect(element.html()).toContain('<h2 id="attribute">Attribute</h2>');
    });

    it('should convert markdown from scope', function () {
      var element = $compile('<div marked="markdown"></div>')($scope);
      expect(element.html()).toContain(html);
    });

    it('should convert markdown from string', function () {
      var element = $compile('<div marked="\'## String\'"></div>')($scope);
      expect(element.html()).toContain('<h2 id="string">String</h2>');
    });

    it('should compile markdown when compile attribute is true', function () {
      $scope.ifValue = false;
      var element = $compile('<div><div marked="markdownCompile" compile="true">JUNK</div></div>')($scope);
      $scope.$digest();
      expect(element.html()).toContain(htmlCompileFalse);
      expect(element.html()).not.toContain('JUNK');

      $scope.ifValue = true;
      $scope.$digest();
      expect(element.html()).toContain(htmlCompileTrue);
      expect(element.html()).not.toContain('JUNK');
    });

    it('should not compile markdown when compile attribute is false', function () {
      $scope.ifValue = false;
      var element = $compile('<div><div marked="markdownCompile" compile="false">JUNK</div></div>')($scope);
      $scope.$digest();
      expect(element.html()).not.toContain(htmlCompileFalse);
      expect(element.html()).not.toContain('JUNK');

      $scope.ifValue = true;
      $scope.$digest();
      expect(element.html()).not.toContain(htmlCompileTrue);
      expect(element.html()).not.toContain('JUNK');
    });

    it('should not compile markdown when in code block', function () {
      $scope.markdownCodeBlock = [
        '  # A heading',
        '',
        '      <div ng-show="ifValue">This should not be compiled</div>'
      ].join('\r\n');

      var element = $compile('<div><div marked="markdownCodeBlock" compile="true">JUNK</div></div>')($scope);
      $scope.$digest();
      expect(element.html()).not.toContain('class="ng-scope ng-hide"');
      expect(element.html()).not.toContain('JUNK');

      $scope.ifValue = true;
      $scope.$digest();
      expect(element.html()).not.toContain('class="ng-scope ng-hide"');
      expect(element.html()).not.toContain('JUNK');
    });
  });
});
