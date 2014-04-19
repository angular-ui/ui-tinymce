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
  function compile() {
    element = $compile('<form><textarea id="foo" ui-tinymce="{foo: \'bar\', setup: setupFooBar() }" ng-model="foo"></textarea></form>')(scope);
    angular.element(document.getElementsByTagName('body')[0]).append(element);
    scope.$apply();
  }

  describe('compiling this directive', function () {

    it('should include the passed options', function (done) {
      spyOn(tinymce, 'init');
      compile();
      setTimeout(function () {
        expect(tinymce.init).toHaveBeenCalled();
        expect(tinymce.init.calls.mostRecent().args[0].foo).toBe('bar');
        done();
      });
    });

    it('should include the default options', function (done) {
      spyOn(tinymce, 'init');
      compile();
      setTimeout(function () {
        expect(tinymce.init).toHaveBeenCalled();
        expect(tinymce.init.calls.mostRecent().args[0].tinymce.bar).toBe('baz');
        done();
      });
    });

    it('should execute the passed `setup` option', function (done) {
      scope.setupFooBar = jasmine.createSpy('setupFooBar');
      compile();
      setTimeout(function () {
        expect(scope.setupFooBar).toHaveBeenCalled();
        done();
      });
    });
  });

  it('should remove tinymce instance on $scope destruction', function (done) {
    compile();
    setTimeout(function () {
      expect(tinymce.get('foo')).toBeTruthy();

      scope.$destroy();

      expect(tinymce.get('foo')).toBeUndefined();

      done();
    });
  });
  /*
  describe('setting a value to the model', function () {
    it('should update the editor', function() {
      compile();
      runs(function () {
        scope.$apply(function() {
          scope.foo = text;
        });
        expect(tinymce.get('foo').getContent()).toEqual(text);
      });
    });
    it('should handle undefined gracefully', function() {
      compile();
      runs(function () {
        scope.$apply(function() {
          scope.foo = undefined;
        });
        expect(tinymce.get('foo').getContent()).toEqual('');
      });
    });
    it('should handle null gracefully', function() {
      compile();
      runs(function () {
        scope.$apply(function() {
          scope.foo = null;
        });
        expect(tinymce.get('foo').getContent()).toEqual('');
      });
    });
  });
  describe('using the editor', function () {
    it('should update the model', function() {
      compile();
      runs(function () {
        tinymce.get('foo').setContent(text);
        expect(scope.foo).toEqual(text);
      });
    });
  });
  */
});
