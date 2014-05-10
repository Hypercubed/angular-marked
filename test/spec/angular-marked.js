'use strict';

// TODO: test options
// TODO: test ng-include
// TODO: test marked.setOptions

describe('Provider: marked,', function () {

  var theMarkedProvider,
    $injector;

  beforeEach(function () {
      var fakeModule = angular.module('test.app.config', function () {});
      fakeModule.config( function (markedProvider) {
          theMarkedProvider = markedProvider;
      });

      module('hc.marked', 'test.app.config');

      inject(function () {});
  });

  it('should provide a provider', inject(function ($injector) {

    expect(theMarkedProvider).not.toBeUndefined();

    expect($injector.get('marked').defaults.gfm).toBe(true);  // the default

    theMarkedProvider.setOptions({gfm: false});

    expect($injector.get('marked').defaults.gfm).toBe(false);

  }));
});

describe('Directive: marked,', function () {

  // load the directive's module
  beforeEach(module('hc.marked'));

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
