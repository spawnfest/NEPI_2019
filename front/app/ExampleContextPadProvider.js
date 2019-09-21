/**
 * A example context pad provider.
 */
export default function ExampleContextPadProvider(connect, contextPad, modeling) {
  this._connect = connect;
  this._modeling = modeling;

  contextPad.registerProvider(this);
}

ExampleContextPadProvider.$inject = [
  'connect',
  'contextPad',
  'modeling'
];

ExampleContextPadProvider.prototype.activate = function(element) {
  debugger;
  var context = {};

  if (element.label) {
    assign(context, {
      bounds: element.labelBounds || element,
      text: element.label
    });

    assign(context, {
      options: this.options || {}
    });

    return context;
  }
};

ExampleContextPadProvider.prototype.update = function(element, text, oldText, bounds) {
  element.label = text;

  var labelBounds = element.labelBounds || element;

  assign(labelBounds, bounds);
};

ExampleContextPadProvider.prototype.setOptions = function(options) {
  this.options = options;
};

ExampleContextPadProvider.prototype.getContextPadEntries = function(element) {
  var connect = this._connect,
      modeling = this._modeling;

  function removeElement() {
    modeling.removeElements([ element ]);
  }

  function startConnect(event, element, autoActivate) {
    connect.start(event, element, autoActivate);
  }

  return {
    'delete': {
      group: 'edit',
      className: 'context-pad-icon-remove',
      title: 'Remove',
      action: {
        click: removeElement,
        dragstart: removeElement
      }
    },
    'connect': {
      group: 'edit',
      className: 'context-pad-icon-connect',
      title: 'Connect',
      action: {
        click: startConnect,
        dragstart: startConnect
      }
    }
  };
};