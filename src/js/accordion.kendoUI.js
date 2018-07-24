(function() {
  var kendo = window.kendo,
  ui = kendo.ui,
  Widget = ui.Widget,
  CHANGE = 'change';

  var Accordion = Widget.extend({
    accordionObjList: {},
    init: function(element, options) {
      kendo.ui.Widget.fn.init.call(this, element, options);
      this.template = this._constructTemplate(this.options.template);
      this._dataSource();
    },
    options: {
      name: 'Accordion',
      autoBind: true,
      template: '',
      settings: {
        triggerSelector: '[data-k-accordion-trigger]',
        triggerActiveClass: 'active',
        bodyActiveClass: 'active',
        accordionIdData: 'data-k-accordion-id'
      }
    },
    _unqueCounter: 0,
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
        that._build();
      });

      if (that.options.autoBind) {
        that.dataSource.fetch();
      }
    },
    _build: function() {
      for (var i = this.element.length - 1; i >= 0; i--) {
        this._setAccrodion(this.element[i]);
      }
    },
    _setUnquiIds: function(index) {
      var result = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4) + '_' + index++;
      return result;
    },
    _constructTemplate: function(inputTelplate) {
      var template =
      `# ++this._unqueCounter; var id = this._setUnquiIds(this._unqueCounter); #
      <div class="k-accordion__title" data-k-accordion-trigger data-k-accordion-id="#= id #">
      <h3>#= data.title #</h3>
      </div>
      <div class="k-accordion__body" data-k-accordion-id="#= id #">#= data.body #</div>`;

      return inputTelplate ? kendo.template(inputTelplate) : kendo.template(template).bind(this);
    },
    _addAccordionObj: function(accHoldeEl, accTrigerEl) {
      var accId = accTrigerEl.getAttribute(this.options.settings.accordionIdData);

      try {
        if (!accId) {
          throw 'Error: Missing \'accordionId\' in trigger element:';
        }
      } catch(err) {
        console.log('%c' + err, 'color: red');
        console.log(accTrigerEl);
      }

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
    },
    _setAccrodion: function(accordoionContinerEl) {
      var accordionTriggerEls = accordoionContinerEl.querySelectorAll(this.options.settings.triggerSelector);

      for (var i = 0; i < accordionTriggerEls.length; i++) {
        this._addAccordionObj(accordoionContinerEl, accordionTriggerEls[i]);
        this._setTriggersEvent(accordionTriggerEls[i]);
      }
    },
    _setTriggersEvent: function(accTriggerEl) {
      accTriggerEl.addEventListener('click', this._triggerClick.bind(this, accTriggerEl));
    },
    _triggerClick: function(accTriggerEl) {
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
