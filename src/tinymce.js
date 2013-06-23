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
        var expression, options, tinyInstance;
        // generate an ID if not present
        if (!attrs.id) {
          attrs.$set('id', 'uiTinymce' + generatedIds++);
        }
        options = {
          // Update model when calling setContent (such as from the source editor popup)
          setup: function (ed) {
            ed.on('init', function(args) {
              ngModel.$render();
            });
            // Update model on button click
            ed.on('ExecCommand', function (e) {
              ed.save();
              ngModel.$setViewValue(elm.val());
              if (!scope.$$phase) {
                scope.$apply();
              }
            });
            // Update model on keypress
            ed.on('KeyUp', function (e) {
              console.log(ed.isDirty());
              ed.save();
              ngModel.$setViewValue(elm.val());
              if (!scope.$$phase) {
                scope.$apply();
              }
            });
          },
          mode: 'exact',
          elements: attrs.id
        };
        if (attrs.uiTinymce) {
          expression = scope.$eval(attrs.uiTinymce);
        } else {
          expression = {};
        }
        angular.extend(options, uiTinymceConfig, expression);
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
