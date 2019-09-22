import inherits from 'inherits';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';


/**
 * A custom rule provider that decides what elements can be
 * dropped where based on a `vendor:allowDrop` BPMN extension.
 *
 * See {@link BpmnRules} for the default implementation
 * of BPMN 2.0 modeling rules provided by bpmn-js.
 *
 * @param {EventBus} eventBus
 */
export default function CustomRules(eventBus) {
  eventBus.on('commandStack.connection.create.canExecute', 2000, (event) => {
    var source = event.context.source;
    var target = event.context.target;

    if (source === null || target === null)
      return;

    if ((source.type === 'bpmn:ServiceTask' && target.type === 'bpmn:UserTask') ||
        (source.type === 'bpmn:ServiceTask' && target.type === 'bpmn:ServiceTask'))
      return false;

    if (target.incoming.length > 0)
      return false;
  });

  RuleProvider.call(this, eventBus);
}

inherits(CustomRules, RuleProvider);

CustomRules.$inject = [ 'eventBus' ];