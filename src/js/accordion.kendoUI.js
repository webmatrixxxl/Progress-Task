(function() {
  var kendo = window.kendo,
  ui = kendo.ui,
  Widget = ui.Widget,

  CHANGE = 'change';

  var Accordion = Widget.extend({
    accordionObjList: {},
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
        triggerSelector: '[data-accordion-trigger]',
        triggerActiveClass: 'active',
        accordionIdData: 'data-accordion-id'

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
        this._setAccrodion(this.element[i]);
      }
    },
    _addAccordionObj: function (accHoldeEl, accEl) {
      var accId = accEl.getAttribute(this.options.settings.accordionIdData);

      if (this.accordionObjList.accId) {
        return;
      }

      this.accordionObjList[accId] = {
        accId: accId,
        element: accHoldeEl,
        accEls: {
          triggersEls: null,
          bodyEls: null
        }
      };
    },
    _setAccrodion: function (accordoionContinerEl) {
      var accordionTriggerEls = accordoionContinerEl.querySelectorAll(this.options.settings.triggerSelector);

      if (!(accordionTriggerEls instanceof NodeList)) {
        throw('NodeList is expected as trigers list');
        return;
      }

      for (var i = 0; i < accordionTriggerEls.length; i++) {
        this._addAccordionObj(accordoionContinerEl, accordionTriggerEls[i]);
        this._setTriggersEvent(accordionTriggerEls[i]);
      }
    },
    _setTriggersEvent: function (accTriggerEl) {
      console.log(accTriggerEl);
      accTriggerEl.addEventListener('click', this.open.bind(this, accTriggerEl));
    },
    open: function (accTriggerEl) {

      accTriggerEl.classList.add(this.options.settings.triggerActiveClass);
      var accId = accTriggerEl.getAttribute(this.options.settings.accordionIdData);

      if (!this.accordionObjList[accId].accEls.bodyEls) {
        console.log(this.accordionObjList[accId].element);
        var bodyEls = this.accordionObjList[accId].element.querySelectorAll('[' + this.options.settings.accordionIdData + '="' + accId + '"]');
        console.log(bodyEls);
        this.accordionObjList[accId].accEls.bodyEls = bodyEls;
      }

      for (var i = this.accordionObjList[accId].accEls.bodyEls.length - 1; i >= 0; i--) {
        console.log('aa');
        this.accordionObjList[accId].accEls.bodyEls[i].classList.add('active');
      }
    }
  });

  ui.plugin(Accordion);

})(jQuery);
