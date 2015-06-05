/**
 * Binds a TinyMCE widget to <textarea> elements.
 */
angular.module('ui.tinymce', [])
  .value('uiTinymceConfig', {})
  .directive('uiTinymce', ['$rootScope', '$window', 'uiTinymceConfig', function($rootScope, $window, uiTinymceConfig) {
    uiTinymceConfig = uiTinymceConfig || {};
    var generatedIds = 0;
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        if (!$window.tinymce) {
          return;
        }

        var expression, options, tinyInstance,
          updateView = function(editor) {
            if (options.raw === true) {
              ngModel.$setViewValue(editor.getContent({format: 'text'}).trim());
            } else {
              ngModel.$setViewValue(editor.getContent().trim());
            }
            if (!$rootScope.$$phase) {
              scope.$apply();
            }
          };

        // generate an ID if not present
        if (!attrs.id) {
          attrs.$set('id', 'uiTinymce' + generatedIds++);
        }

        expression = {};

        angular.extend(expression, scope.$eval(attrs.uiTinymce));

        // make config'ed setup method available
        if (expression.setup) {
          var configSetup = expression.setup;
          delete expression.setup;
        }

        options = {
          // Update model when calling setContent (such as from the source editor popup)
          setup: function(ed) {
            var args;
            ed.on('init', function(args) {
              ngModel.$render();
              ngModel.$setPristine();
            });
            // Update model on button click
            ed.on('ExecCommand', function(e) {
              ed.save();
              updateView(ed);
            });
            // Update model on keypress
            ed.on('KeyUp', function(e) {
              ed.save();
              updateView(ed);
            });
            // Update model on change, i.e. copy/pasted text, plugins altering content
            ed.on('SetContent', function(e) {
              if (!e.initial && ngModel.$viewValue !== e.content) {
                ed.save();
                updateView(ed);
              }
            });
            ed.on('blur', function(e) {
              element[0].blur();
            });
            // Update model when an object has been resized (table, image)
            ed.on('ObjectResized', function(e) {
              ed.save();
              updateView(ed);
            });
            // Update model on node change (to detect color changes)
            ed.on('nodeChange', function (e) {
              ed.save();
              updateView();
            });
            if (configSetup) {
              configSetup(ed, {
                updateView: updateView
              });
            }
          },
          selector: '#' + attrs.id
        };
        // extend options with initial uiTinymceConfig and options from directive attribute value
        angular.extend(options, uiTinymceConfig, expression);
        tinymce.init(options);

        ngModel.$render = function() {
          if (!tinyInstance) {
            tinyInstance = tinymce.get(attrs.id);
          }
          if (tinyInstance) {
            tinyInstance.setContent(ngModel.$viewValue || '');
          }
        };

        elm.on('$destroy', function() {
          if (!tinyInstance) {
            tinyInstance = tinymce.get(attrs.id);
          }
          if (tinyInstance) {
            tinyInstance.remove();
            tinyInstance = null;
          }
        });
      }
    };
  }]);
