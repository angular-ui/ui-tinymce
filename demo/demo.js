angular.module('ui.tinymce')
  .controller('DemoCtrl', function($sce) {
    var ctrl = this;

    this.updateHtml = function() {
      ctrl.tinymceHtml = $sce.trustAsHtml(ctrl.tinymce);
    };
  });