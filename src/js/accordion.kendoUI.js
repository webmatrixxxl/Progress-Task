(function() {
  var kendo = window.kendo,
  ui = kendo.ui,
  Widget = ui.Widget,

  CHANGE = 'change';

  var Accordion = Widget.extend({
    accordionObjList: {},
    init: function(element, options) {
      kendo.ui.Widget.fn.init.call(this, element, options);
      this.template = kendo.template(this._constructTemplate(this.options.template));
      this._dataSource();
      this.onInit();
      console.log(this);
    },
    options: {
      name: 'Accordion',
      autoBind: true,
      template: '',
      settings: {
        triggerSelector: '[data-accordion-trigger]',
        triggerActiveClass: 'active',
        bodyActiveClass: 'active',
        accordionIdData: 'data-accordion-id',
        containerClass: 'accordion'

      }
    },
    refresh: function() {
      if (!this.options.dataSource) {
        return;
      }

      var view = this.dataSource.view(),
      html = kendo.render(this.template, view);

      this.element.html(html);
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
    onInit: function() {
      for (var i = this.element.length - 1; i >= 0; i--) {
        this._setAccrodion(this.element[i]);
      }
    },
    _setUnquiIds: function(accEl) {
      return 1;
      // var unqueId = + new Date();
      // unqueId = unqueId.toString();
      // unqueId = unqueId.substr(unqueId.length - 4);
      // accEl.setAttribute(this.options.settings.accordionIdData, unqueId);
    },
    _constructTemplate: function(inputTelplate) {
      var template =
      `<div class="accordion__title" data-accordion-trigger data-accordion-id="#= getKendo('Accordion')._setUnquiIds(1) #">
      <h3>#= data #</h3>
      </div>
      <div class="accordion__body">#= data #</div>`;

      return inputTelplate ? inputTelplate : template;
    },
    _addAccordionObj: function(accHoldeEl, accEl) {
      var accId = accEl.getAttribute(this.options.settings.accordionIdData);

      if (this.accordionObjList.accId) {
        return;
      }

      this.accordionObjList[accId] = {
        accId: accId,
        element: accHoldeEl,
        isOpened: false,
        accEls: {
          triggersEls: null,
          bodyEls: null
        }
      };
      console.log('KOOOOOORR');
      console.log(this.accordionObjList);
      console.log(accId);
    },
    _setAccrodion: function(accordoionContinerEl) {
      var accordionTriggerEls = accordoionContinerEl.querySelectorAll(this.options.settings.triggerSelector);

      if (!(accordionTriggerEls instanceof NodeList)) {
        throw('NodeList is expected as trigers list');
        return;
      }

      for (var i = 0; i < accordionTriggerEls.length; i++) {
       if (this.options.dataSource) {
          this._setUnquiIds(accordionTriggerEls[i]);
        }

        this._addAccordionObj(accordoionContinerEl, accordionTriggerEls[i]);


        this._setTriggersEvent(accordionTriggerEls[i]);
      }
    },
    _setTriggersEvent: function(accTriggerEl) {
      console.log(accTriggerEl);
      accTriggerEl.addEventListener('click', this._triggerClick.bind(this, accTriggerEl));
    },
    _triggerClick: function(accTriggerEl) {
      console.log('aaaa');
      console.log(accTriggerEl);
      var accId = accTriggerEl.getAttribute(this.options.settings.accordionIdData);

      if (!this.accordionObjList[accId].accEls.bodyEls) {
        var bodyElsSelector = '[' + this.options.settings.accordionIdData + '="' + accId + '"]';
        var bodyEls = this.accordionObjList[accId].element.querySelectorAll(bodyElsSelector);
        this.accordionObjList[accId].accEls.bodyEls = bodyEls;
      }

      if (this.accordionObjList[accId].isOpened) {
        this.close(accTriggerEl, accId);
      } else {
        this.open(accTriggerEl, accId);
      }
    },
    open: function(accTriggerEl, accId) {
      accTriggerEl.classList.add(this.options.settings.triggerActiveClass);
      var bodyEls = this.accordionObjList[accId].accEls.bodyEls;

      for (var i = bodyEls.length - 1; i >= 0; i--) {
        bodyEls[i].classList.add('active');
      }

      this.accordionObjList[accId].isOpened = true;
    },
    close: function(accTriggerEl, accId) {
      accTriggerEl.classList.remove(this.options.settings.triggerActiveClass);
      var bodyEls = this.accordionObjList[accId].accEls.bodyEls;

      for (var i = bodyEls.length - 1; i >= 0; i--) {
        bodyEls[i].classList.remove('active');
      }

      this.accordionObjList[accId].isOpened = false;
    }
  });

  //
  ui.plugin(Accordion);

})(jQuery);
