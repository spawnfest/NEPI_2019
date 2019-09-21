import { assign} from 'min-dash';

export default function DirectEditingProvider(directEditing) {
  directEditing.registerProvider(this);
}

DirectEditingProvider.$inject = [ 'directEditing' ];

DirectEditingProvider.prototype.activate = function(element) {
  debugger;
  var context = {};

  if (element.label) {
    assign(context, {
      bounds: element.labelBounds || element,
      text: element.label.text
    });

    assign(context, {
      options: this.options || {}
    });

    return context;
  }
};

DirectEditingProvider.prototype.update = function(element, text, oldText, bounds) {
  debugger;
  element.label.text = text;

  var labelBounds = element.labelBounds || element;
  element.label.text

  assign(labelBounds, bounds);
};

DirectEditingProvider.prototype.setOptions = function(options) {
  this.options = options;
};