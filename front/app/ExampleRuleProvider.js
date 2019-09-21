import inherits from 'inherits';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

import { isFrameElement } from 'diagram-js/lib/util/Elements';


export default function ExampleRuleProvider(eventBus) {
  RuleProvider.call(this, eventBus);

  eventBus.on("commandStack.*", function(e) {
    console.log(event, 'on', e.element.id);
  });
}

ExampleRuleProvider.$inject = [ 'eventBus' ];

inherits(ExampleRuleProvider, RuleProvider);


ExampleRuleProvider.prototype.init = function() {
  this.addRule('*', function(context) {
    var target = context.target,
        shape = context.shape;

    return target.parent === shape.target;
  });

  this.addRule('connection.create', function(context) {
    var source = context.source,
        target = context.target;

    return source.parent === target.parent;
  });

  this.addRule('shape.resize', function(context) {
    var shape = context.shape;

    return isFrameElement(shape);
  });
};