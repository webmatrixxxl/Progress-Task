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
        triggerClass: 'k-accordion__heading',
        triggerActiveClass: 'active',
        bodyClass: 'k-accordion__body',
        bodyActiveClass: 'active',
        accordionIdData: 'data-k-accordion-id',
        animationClass: 'k-accordion__body--animate'
      }
    },
    _unqueCounter: 0,
    open: function(accTriggerEl, accId) {
      if (this.accordionObjList[accId].isInProggress) return;

      console.log('open');

      this.accordionObjList[accId].isInProggress = true;
      accTriggerEl.classList.add(this.options.settings.triggerActiveClass);
      var bodyEls = this.accordionObjList[accId].accEls.bodyEls;

      for (var i = bodyEls.length - 1; i >= 0; i--) {
        var isAnimated = this._isElAnimated(bodyEls[i]);
        if (!isAnimated) this._onBeforeOpen(bodyEls[i], accId);
        bodyEls[i].classList.add('active');
        bodyEls[i].style.height = (this.accordionObjList[accId].isOpened ? 0 : bodyEls[i].scrollHeight) + 'px';
        if (!isAnimated) this._onAfterOpen(bodyEls[i], accId);
      }
    },
    close: function(accTriggerEl, accId) {
      if (this.accordionObjList[accId].isInProggress) return;

      console.log('close');

      this.accordionObjList[accId].isInProggress = true;

      accTriggerEl.classList.remove(this.options.settings.triggerActiveClass);
      var bodyEls = this.accordionObjList[accId].accEls.bodyEls;

      for (var i = bodyEls.length - 1; i >= 0; i--) {
        var isAnimated = this._isElAnimated(bodyEls[i]);
        if (!isAnimated) this._onBeforeClose(bodyEls[i], accId);
        bodyEls[i].style.height = bodyEls[i].scrollHeight + 'px';
        bodyEls[i].classList.remove('active');

        setTimeout(function(bodyEl) {
          bodyEl.style.height = 0 + 'px';
          if (!isAnimated) this._onAfterClose(bodyEl, accId);
        }.bind(this, bodyEls[i]), 0);
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
      <div class="#= this.options.settings.triggerClass #" data-k-accordion-trigger data-k-accordion-id="#= id #">
      <h3>#= data.title #</h3>
      </div>
      <div class="#= this.options.settings.bodyClass + ' ' + this.options.settings.animationClass #" data-k-accordion-id="#= id #">#= data.body #</div>`;

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
          triggersEls: [],
          bodyEls: []
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
    _isElAnimated: function(el) {
      var isAnimated = false;
      var style = window.getComputedStyle(el, null);
      var animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');
      var transDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');

      if (animDuration > 0 || transDuration > 0) {
        isAnimated = true;
      }

      return isAnimated;
    },
    _triggerClick: function(accTriggerEl) {
      var accId = accTriggerEl.getAttribute(this.options.settings.accordionIdData);

      if (!this.accordionObjList[accId].accEls.bodyEls.length) {
        var bodyElsSelector = '.' + this.options.settings.bodyClass + '[' + this.options.settings.accordionIdData + '="' + accId + '"]';
        var bodyEls = this.accordionObjList[accId].element.querySelectorAll(bodyElsSelector);
        this.accordionObjList[accId].accEls.bodyEls = bodyEls;

        for (var i = bodyEls.length - 1; i >= 0; i--) {
          this.accordionObjList[accId].accEls._startAnimation = this._startAnimation.bind(this, bodyEls[i], accId);
          this.accordionObjList[accId].accEls._endAnimation = this._endAnimation.bind(this, bodyEls[i], accId);

          bodyEls[i].addEventListener('animationstart', this.accordionObjList[accId].accEls._startAnimation);
          bodyEls[i].addEventListener('animationend', this.accordionObjList[accId].accEls._endAnimation);
          bodyEls[i].addEventListener('transitionstart', this.accordionObjList[accId].accEls._startAnimation);
          bodyEls[i].addEventListener('transitionend', this.accordionObjList[accId].accEls._endAnimation);
        }
      }

      if (this.accordionObjList[accId].isOpened) {
        this.close(accTriggerEl, accId);
      } else {
        this.open(accTriggerEl, accId);
      }
    },
    _onBeforeOpen: function(bodyEl, accId) {

    },
    _onAfterOpen: function(bodyEl, accId) {
      bodyEl.style.height = 'auto';
      this.accordionObjList[accId].isOpened = true;
      this.accordionObjList[accId].isInProggress = false;

    },
    _onBeforeClose: function(bodyEl, accId) {

    },
    _onAfterClose: function(bodyEl, accId) {
      this.accordionObjList[accId].isOpened = false;
      this.accordionObjList[accId].isInProggress = false;
    },
    _startAnimation: function(bodyEl, accId) {
      if (!this.accordionObjList[accId].isOpened) {
        console.log('befor opening start');
        this._onBeforeOpen(bodyEl, accId);
      } else {
        this._onBeforeClose(bodyEl, accId);
        console.log('befor closing start');
      }
      // TODO: implement some events
    },
    _endAnimation: function(bodyEl, accId) {
      if (!this.accordionObjList[accId].isOpened) {
        console.log('after opening finished');
        this._onAfterOpen(bodyEl, accId);
      } else {
        console.log('after closing finished');
        this._onAfterClose(bodyEl, accId);
      }

      // TODO: implement some events
    }
  });

  //
  ui.plugin(Accordion);

})(jQuery);
