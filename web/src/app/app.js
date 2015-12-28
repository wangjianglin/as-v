
(function(app) {
  app.AppComponent = ng.core
    .Component({
      selector: 'body'
      ,
      template: '<h1>My First Angular 2 App</h1>'
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));



(function(app) {
  document.addEventListener('DOMContentLoaded', function() {
    ng.platform.browser.bootstrap(app.AppComponent);
  });
})(window.app || (window.app = {}));