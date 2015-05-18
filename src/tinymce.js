/**
 * Binds a TinyMCE widget to <textarea> elements.
 * ui-tinymce-0.0.5 - modified to run 
 */
angular.module('ui.tinymce', [])
  .value('uiTinymceConfig', {})
  .directive('uiTinymce', ['uiTinymceConfig', '$timeout', function (uiTinymceConfig, $timeout) {
    uiTinymceConfig = uiTinymceConfig || {};
    var generatedIds = 0;
    return {
      priority: 10,
      require: 'ngModel',
      link: function (scope, elm, attrs, ngModel) {
        var expression, options, tinyInstance,
          updateView = function () {
            ngModel.$setViewValue(elm.val());
            if (!scope.$root.$$phase) {
              scope.$apply();
            }
          };

        // generate an ID if not present
        if (!attrs.id) {
          attrs.$set('id', 'uiTinymce' + generatedIds++);
        }

        // Run in a $timeout so that the attr's will be updated before parsing them
        $timeout(function() {
          if (attrs.uiTinymce) {
            expression = scope.$eval(attrs.uiTinymce);
          } else {
            expression = {};
          }

          // make config'ed setup method available
          if (expression.setup) {
            var configSetup = expression.setup;
            delete expression.setup;
          }

          options = {
            // Update model when calling setContent (such as from the source editor popup)
            setup: function (ed) {
              var args;
              ed.on('init', function(args) {
                ngModel.$render();
              });
              // Update model on button click
              ed.on('ExecCommand', function (e) {
                ed.save();
                updateView();
              });
              // Update model on keypress
              ed.on('KeyUp', function (e) {
                ed.save();
                updateView();
              });
              // Update model on change, i.e. copy/pasted text, plugins altering content
              ed.on('SetContent', function (e) {
                if(!e.initial){
                  ed.save();
                  updateView();
                }
              });
              ed.on('blur', function(e) {
                  elm.blur();
              });
              if (configSetup) {
                configSetup(ed);
              }
            },
            mode: 'exact',
            elements: attrs.id
          };
          // extend options with initial uiTinymceConfig and options from directive attribute value
          angular.extend(options, uiTinymceConfig, expression);
          tinymce.init(options);
        });

        ngModel.$render = function() {
          if (!tinyInstance) {
            tinyInstance = tinymce.get(attrs.id);
          }
          if (tinyInstance) {
            tinyInstance.setContent(ngModel.$viewValue || '');
          }
        };

        scope.$on('$destroy', function() {
          if (!tinyInstance) { tinyInstance = tinymce.get(attrs.id); }
          if (tinyInstance) {
            tinyInstance.remove();
            tinyInstance = null;
          }
        });
      }
    };
  }]);
