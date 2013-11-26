/**
 * Binds a TinyMCE widget to <textarea> elements.
 */
angular.module('ui.tinymce', [])
  .value('uiTinymceConfig', {})
  .directive('uiTinymce', ['uiTinymceConfig', function (uiTinymceConfig) {
    uiTinymceConfig = uiTinymceConfig || {};
    var generatedIds = 0;
    return {
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

        if (attrs.uiTinymce) {
          expression = scope.$eval(attrs.uiTinymce);
        } else {
          expression = {};
        }
        options = {
          // Update model when calling setContent (such as from the source editor popup)
          mode: 'exact',
          elements: attrs.id
        };
        // extend options with initial uiTinymceConfig and options from directive attribute value
        angular.extend(options, uiTinymceConfig, expression);
        // This should be called after doing angular.extend otherwise it gets replaced by the one that's inside express
        options.setup = function (ed) {
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
          if (expression.setup) {
            expression.setup(ed);
          }
        };
        setTimeout(function () {
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
      }
    };
  }]);
