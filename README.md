angular-marked [![Bower version](https://badge.fury.io/bo/angular-marked.svg)](http://badge.fury.io/bo/angular-marked)
===

AngularJS Markdown using [marked](https://github.com/chjj/marked).

**Please note:** neither this directive nor marked (by default) implement sanitization. As always, sanitizing is necessary for user-generated content.

[![get this with bower](http://benschwarz.github.io/bower-badges/badge@2x.png)](http://bower.io/ "get this with bower")

## Usage

1. `bower install angular-marked`
2. Include `marked.js` (`bower_components/marked/lib/marked.js`).
3. Include `angular-marked.js`(`bower_components/angular-marked/angular-marked.js`).
4. Add `hc.marked` as a module dependency to your app.

### Set default options (optional)

```js
app.config(['markedProvider', function(markedProvider) {
  markedProvider.setOptions({gfm: true});
}]);
```

Example using [highlight.js Javascript syntax highlighter](http://highlightjs.org/) (must include highlight.js script).

```js
markedProvider.setOptions({
  gfm: true,
  tables: true,
  highlight: function (code, lang) {
    if (lang) {
      return hljs.highlight(lang, code, true).value;
    } else {
      return hljs.highlightAuto(code).value;
    }
  }
});
```

### Override Rendered Markdown Links

Example overriding the way custom markdown links are displayed to open in new windows:

```js
app.config(['markedProvider', function(markedProvider) {
  markedProvider.setRenderer({
    link: function(href, title, text) {
      return "<a href='" + href + "'" + (title ? " title='" + title + "'" : '') + " target='_blank'>" + text + "</a>";
    }
  });
}]);
```

### Use as a directive

```html
<marked>
  # Markdown directive
  *It works!*  
</marked>
```

Bind the markdown input to a scope variable:

```html
<div marked="my_markdown">
</div>
<!-- Uses $scope.my_markdown -->
```

Include a markdown file:

```html
<div marked src="'README.md'">
</div>
<!-- Uses markdown content from README.md -->
```

Or a template (great for md that includes code blocks):

```html
<script type="text/ng-template" id="tpl.md">
  ## Markdown

  **Code blocks**

      This is <b>bold</b>

  **Ampersands**

  Star Trek & Star Wars
</script>

<div marked src="'tpl.md'"></div>
<!-- Uses markdown content from tpl.md -->
```

### As a service

```js
app.controller('myCtrl', ['marked', function(marked) {
  $scope.html = marked('#TEST');
}]);
```

## Testing

Install npm and bower dependencies:

```bash
npm install
bower install
npm test
```

## Why?

I wanted to use `marked` instead of `showdown` as used in `angular-markdown-directive` as well as expose the option to globally set defaults.  Yes, it is probably best to avoid creating a bunch of angular wrapper modules... but I use this enough across multiple projects to make it worth while for me.  Use it if you like.  Pull requests are welcome.

## Acknowledgments
Based on [angular-markdown-directive](https://github.com/btford/angular-markdown-directive) by [briantford](http://briantford.com/) which, in turn, is based on [this excellent tutorial](http://blog.angularjs.org/2012/05/custom-components-part-1.html) by [@johnlinquist](https://twitter.com/johnlindquist).

## License
Copyright (c) 2013-2015 Jayson Harshbarger [![Gittip donate button](http://img.shields.io/gratipay/Hypercubed.svg)](https://www.gittip.com/hypercubed/ "Donate weekly to this project using Gittip")
[![Paypal donate button](http://img.shields.io/badge/paypal-donate-brightgreen.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=X7KYR6T9U2NHC "One time donation to this project using Paypal")

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
