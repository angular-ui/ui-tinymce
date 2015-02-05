/*global describe, beforeEach, module, inject, it, spyOn, expect, $, angular, afterEach, runs, waits */
describe('uiTinymce', function () {
  'use strict';

  var scope, $compile, element, text = '<p>Hello</p>';
  beforeEach(module('ui.tinymce'));
  beforeEach(function () {
    // throw some garbage in the tinymce cfg to be sure it's getting thru to the directive
    angular.module('ui.tinymce').value('uiTinymceConfig', {tinymce: {bar: 'baz'}});
  });
  beforeEach(inject(function (_$rootScope_, _$compile_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
  }));

  afterEach(function () {
    angular.module('ui.tinymce').value('uiTinymceConfig', {});
    element.remove();
  });

  /**
   * Asynchronously runs the compilation.
   */
  function compile(tinymceHtml) {
    element = $compile(tinymceHtml)(scope);
    angular.element(document.getElementsByTagName('body')[0]).append(element);
    scope.$apply();
  }

  function compileBasic() {
    compile('<form><textarea id="foo" ui-tinymce="{foo: \'bar\', setup: setupFooBar() }" ng-model="foo"></textarea></form>');
  }

  describe('compiling this directive', function () {

    it('should include the passed options', function (done) {
      spyOn(tinymce, 'init');
      compileBasic();
      setTimeout(function () {
        expect(tinymce.init).toHaveBeenCalled();
        expect(tinymce.init.calls.mostRecent().args[0].foo).toBe('bar');
        done();
      });
    });

    it('should include the default options', function (done) {
      spyOn(tinymce, 'init');
      compileBasic();
      setTimeout(function () {
        expect(tinymce.init).toHaveBeenCalled();
        expect(tinymce.init.calls.mostRecent().args[0].tinymce.bar).toBe('baz');
        done();
      });
    });

    it('should execute the passed `setup` option', function (done) {
      scope.setupFooBar = jasmine.createSpy('setupFooBar');
      compileBasic();
      setTimeout(function () {
        expect(scope.setupFooBar).toHaveBeenCalled();
        done();
      });
    });
  });

  it('should remove tinymce instance on $scope destruction', function (done) {
    compileBasic();
    setTimeout(function () {
      expect(tinymce.get('foo')).toBeDefined();

      scope.$destroy();

      expect(tinymce.get('foo')).toBeNull();

      done();
    });
  });

  describe('setting a value to the model', function () {
    it('should update the editor', function(done) {
      compileBasic();
      setTimeout(function () {
        scope.foo = text;
        scope.$apply();

        expect(tinymce.get('foo').getContent()).toEqual(text);

        done();
      });
    });
    it('should handle undefined gracefully', function (done) {
      compileBasic();
      setTimeout(function () {
        scope.foo = undefined;
        scope.$apply();

        expect(tinymce.get('foo').getContent()).toEqual('');

        done();
      });
    });
    it('should handle null gracefully', function (done) {
      compileBasic();
      setTimeout(function () {
        scope.foo = null;
        scope.$apply();

        expect(tinymce.get('foo').getContent()).toEqual('');

        done();
      });
    });
  });

  describe('inline mode', function () {
    it('should properly update model', function (done) {
      scope.options = {
        inline: true,
        setup: function(editor) {
          editor.on('init', function() {
            scope.inline = text;
            scope.$apply();

            expect(editor.getContent()).toEqual(text);

            done();
          });
        }
      };
      compile('<form><div id="inline" ui-tinymce="options" ng-model="inline"></div></form>');
    });
  });
  /*describe('using the editor', function () {
    it('should update the model', function (done) {
      compile();
      setTimeout(function () {
        tinymce.get('foo').setContent(text);

        expect(scope.foo).toEqual(text);

        done();
      });
    });
  });*/

});
