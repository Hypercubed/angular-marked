
// TODO: test ng-include

describe('Provider: marked,', function () {
  'use strict';

  beforeEach(module('hc.marked'));

  it('should start with defaults', function () {

    inject(function(marked) {
      expect(marked.defaults.gfm).toBeTruthy();
      expect(marked.defaults.breaks).toBeFalsy();
      expect(marked.defaults.silent).toBeFalsy();
      expect(marked.defaults.langPrefix).toBe('lang-');
    });

  });
  it('should allow for renderers to be overwritten', function(){
    module(function(markedProvider) {
        expect(markedProvider).toBeDefined();
        markedProvider.setRenderer({
            link: function(href, title, text) {
                return '<a href="' + href + '" title="' + title + '" target="_blank">' + text + '</a>';
            }
        });
    });

    inject(function(marked){
        var input = '[Google](http://google.com)';
        var output = marked(input);
        expect(output).toContain('target="_blank"');
    });
  });

  it('should enable changing defaults', function () {

    module(function ( markedProvider ) {
      expect(markedProvider).toBeDefined();
      markedProvider.setOptions({gfm: false, silent: true});
      markedProvider.setRenderer({});
    });

    inject(function(marked) {
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

  var element,
    $scope,
    $httpBackend,
    $compile,
    markdown, html;

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

    html = "<h1 id=\"a-heading\">A heading</h1>\n<p>Hello <em>world</em>. Here is a <a href=\"//hello\">link</a>.\nAnd an image <img src=\"http://angularjs.org/img/AngularJS-large.png\" alt=\"alt\">.</p>\n<pre><code>&lt;test&gt;Code goes here.&lt;/test&gt;\n</code></pre>";

    $scope.file = 'file.md';
    $compile = _$compile_;

    $templateCache.put($scope.file, markdown);

  }));

  describe('Include', function () {
    it('should convert file', function () {

      element = $compile('<div><div marked src="file">JUNK</div></div>')($scope);
      $scope.$digest();
      expect(element.html()).toContain(html);
      expect(element.html()).toNotContain('JUNK');

    });

    it('should convert file', function () {
      element = $compile('<div><div marked src="\'file.md\'">JUNK</div></div>')($scope);
      $scope.$digest();
      expect(element.html()).toContain(html);
      expect(element.html()).toNotContain('JUNK');
    });
  });

  describe('Element,', function () {
    it('should convert markdown', function () {
      element = $compile('<marked>## Element</marked>')($scope);
      expect(element.html()).toContain('<h2 id="element">Element</h2>');
    });

    it('should convert markdown', function () {
      element = $compile('<marked>**test**</marked>')($scope);
      expect(element.html()).toContain('<p><strong>test</strong></p>');
    });

    it('should convert markdown', function () {
      element = $compile('<marked>`test`</marked>')($scope);
      expect(element.html()).toContain('<p><code>test</code></p>');
    });

    it('should unindent', function () {
      element = $compile('<marked>    **test**\n    1 2 3</marked>')($scope);
      expect(element.html()).toContain('<p><strong>test</strong>\n1 2 3</p>');
    });

    it('should unindent based on shorted whitespace', function () {
      element = $compile('<marked>    **test**\n  1 2 3</marked>')($scope);
      expect(element.html()).toContain('<p>  <strong>test</strong>\n1 2 3</p>');
    });

    it('should handle crlf', function () {
      element = $compile('<marked>    **test**\r\n    1 2 3</marked>')($scope);
      expect(element.html()).toContain('<p><strong>test</strong>\n1 2 3</p>');
    });
  });

  describe('Attribute,', function () {
    it('should convert markdown', function () {
      element = $compile('<div marked>## Attribute</div>')($scope);
      expect(element.html()).toContain('<h2 id="attribute">Attribute</h2>');
    });

    it('should convert markdown from scope', function () {
      element = $compile('<div marked="markdown"></div>')($scope);
      expect(element.html()).toContain(html);
    });

    it('should convert markdown from string', function () {
      element = $compile('<div marked="\'## String\'"></div>')($scope);
      expect(element.html()).toContain('<h2 id="string">String</h2>');
    });
  });
});
