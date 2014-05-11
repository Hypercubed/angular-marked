'use strict';

// TODO: test ng-include

describe('Provider: marked,', function () {

  var markedProvider,
    $injector;

  beforeEach(function () {

      angular.module('test.app.config', function () {})
        .config( function (_markedProvider_) {
          markedProvider = _markedProvider_;
          spyOn(markedProvider, 'setOptions').andCallThrough();
        });

      angular.mock.module('hc.marked', 'test.app.config');

  });

  it('should start with defaults', inject(function ($injector, marked) {

    expect(markedProvider).not.toBeUndefined();

    expect(marked.defaults.gfm).toBeTruthy();
    expect(marked.defaults.breaks).toBeFalsy();
    expect(marked.defaults.silent).toBeFalsy();
    expect(marked.defaults.langPrefix).toBe('lang-');

  }));

  it('should enable changing defaults', inject(function ($injector) {

    markedProvider.setOptions({gfm: true, silent: true});
    expect(markedProvider.setOptions).toHaveBeenCalled();

    var marked = $injector.get('marked');

    expect(marked.defaults.gfm).toBeTruthy();
    expect(marked.defaults.breaks).toBeFalsy();
    expect(marked.defaults.silent).toBeTruthy();
    expect(marked.defaults.langPrefix).toBe('lang-');

  }));

});

describe('Directive: marked,', function () {

  // load the directive's module
  beforeEach(angular.mock.module('hc.marked'));

  var element,
    scope,
    $httpBackend,
    $compile,
    markdown, html;

  beforeEach(inject(function ($rootScope, $templateCache, _$httpBackend_, _$compile_) {

    scope = $rootScope.$new();

    scope.markdown = markdown = "# A heading\n\nHello *world*. Here is a [link](//hello).\nAnd an image ![alt](http://angularjs.org/img/AngularJS-large.png).\n\n    Code goes here.\n";

    html = "<h1 id=\"a-heading\">A heading</h1>\n<p>Hello <em>world</em>. Here is a <a href=\"//hello\">link</a>.\nAnd an image <img src=\"http://angularjs.org/img/AngularJS-large.png\" alt=\"alt\">.</p>\n<pre><code>Code goes here.\n</code></pre>";

    scope.file = 'file.md';

    $httpBackend = _$httpBackend_;
    $compile = _$compile_;

    $httpBackend.expect('GET', scope.file).respond(markdown);

  }));

  describe('Include', function () {
    it('should convert file', function () {

      element = $compile('<div><div marked ng-include="file">JUNK</div></div>')(scope);
      scope.$digest();
      $httpBackend.flush();
      expect(element.html()).toContain(html);
      expect(element.html()).toNotContain('JUNK');

    });

    it('should convert file', function () {
      element = $compile('<div><div marked ng-include="\'file.md\'">JUNK</div></div>')(scope);
      scope.$digest();
      $httpBackend.flush();
      expect(element.html()).toContain(html);
      expect(element.html()).toNotContain('JUNK');
    });
  });

  describe('Element,', function () {
    it('should convert markdown', function () {
      element = $compile('<marked>## Element</marked>')(scope);
      expect(element.html()).toContain('<h2 id="element">Element</h2>');
    });

    it('should convert markdown', function () {
      element = $compile('<marked>**test**</marked>')(scope);
      expect(element.html()).toContain('<p><strong>test</strong></p>');
    });

    it('should convert markdown', function () {
      element = $compile('<marked>`test`</marked>')(scope);
      expect(element.html()).toContain('<p><code>test</code></p>');
    });
  });


  describe('Attribute,', function () {
    it('should convert markdown', function () {
      element = $compile('<div marked>## Attribute</div>')(scope);
      expect(element.html()).toContain('<h2 id="attribute">Attribute</h2>');
    });

    it('should convert markdown from scope', function () {
      element = $compile('<div marked="markdown"></div>')(scope);
      expect(element.html()).toContain(html);
    });

    it('should convert markdown from string', function () {
      element = $compile('<div marked="\'## String\'"></div>')(scope);
      expect(element.html()).toContain('<h2 id="string">String</h2>');
    });
  });

});
