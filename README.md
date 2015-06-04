# ui-tinymce directive [![Build Status](https://travis-ci.org/angular-ui/ui-tinymce.png)](https://travis-ci.org/angular-ui/ui-tinymce)

This directive allows you to add a TinyMCE editor to your form elements.

# Requirements

- AngularJS
- TinyMCE 4

# Testing

We use karma and jshint to ensure the quality of the code.  The easiest way to run these checks is to use grunt:
```
npm install -g grunt-cli
npm install
bower install
grunt
```  

The karma task will try to open Chrome as a browser in which to run the tests.  Make sure this is available or change the configuration in `test\test.config.js` 

# Usage

We use [bower](http://twitter.github.com/bower/) for dependency management.  Add

```
dependencies: {
"angular-ui-tinymce": "latest"
}
```

To your `bower.json` file. Then run

```
bower install
```

This will copy the ui-tinymce files into your `components` folder, along with its dependencies. Load the script files in your application:

```html
<script type="text/javascript" src="app/bower_components/tinymce/tinymce.js"></script>
<script type="text/javascript" src="app/bower_components/angular/angular.js"></script>
<script type="text/javascript" src="app/bower_components/angular-ui-tinymce/tinymce.js"></script>
```

Add the tinymce module as a dependency to your application module:

```javascript
var myAppModule = angular.module('MyApp', ['ui.tinymce'])
```

Apply the directive to your form elements:

```html
<form method="post">
	<textarea ui-tinymce ng-model="tinymceModel"></textarea>
</form>
```
## Options

All the TinyMCE options can be passed through the directive.

```javascript
myAppModule.controller('MyController', function($scope) {
	$scope.tinymceOptions = {
		handle_event_callback: function (e) {
		// put logic here for keypress
		}
	};
});
```
```html
<form method="post">
	<textarea ui-tinymce="tinymceOptions" ng-model="tinymceModel"></textarea>
</form>
```    

## Working with ng-model

The ui-tinymce directive plays nicely with the ng-model directive such as ng-required.

If you add the ng-model directive to same the element as ui-tinymce then the text in the editor is automatically synchronized with the model value.

_The ui-tinymce directive stores and expects the model value to be a standard javascript tinymce object._

