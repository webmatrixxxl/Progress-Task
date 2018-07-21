(function() {
  var kendo = window.kendo,
  ui = kendo.ui,
  Widget = ui.Widget,

  CHANGE = 'change';

  var Accordion = Widget.extend({
    init: function(element, options) {
      var that = this;

      kendo.ui.Widget.fn.init.call(that, element, options);
      that.template = kendo.template(that.options.template || '<p><strong>#= data #</strong></p>');
      this.onInit()
      that._dataSource();
    },
    options: {
      name: 'Accordion',
      autoBind: true,
      template: '',
      settings: {
        triggerSelector: '[data-accordion-trigger]'
      }
    },
    refresh: function() {
      if (!this.options.dataSource) {
        return;
      }

      var that = this,
      view = that.dataSource.view(),
      html = kendo.render(that.template, view);

      that.element.html(html);
    },
    _dataSource: function() {
      var that = this;
      // returns the datasource OR creates one if using array or configuration object

      that.dataSource = kendo.data.DataSource.create(that.options.dataSource);

      // bind to the change event to refresh the widget
      that.dataSource.bind(CHANGE, function() {
        that.refresh();
      });

      if (that.options.autoBind) {
        that.dataSource.fetch();
      }
    },
    onInit: function () {
      for (var i = this.element.length - 1; i >= 0; i--) {
        console.log(this.element[i]);

        var accordionTriggerEls  = this.element[i].querySelectorAll(this.options.settings.triggerSelector);
        console.log(this._setTriggersEvent(accordionTriggerEls));
      }
    },
    _setTriggersEvent: function (accordionTriggerEls) {
      if (!(accordionTriggerEls instanceof NodeList)) {
        throw('NodeList is expected as trigers list');
        return;
      }

      for (var i = 0; i < accordionTriggerEls.length; i++) {
        accordionTriggerEls[i].addEventListener('click', function (accTriggerEl) {
          accTriggerEl.classList.add('clocked KOR');
        });
      }

    }
  });

  ui.plugin(Accordion);

})(jQuery);
