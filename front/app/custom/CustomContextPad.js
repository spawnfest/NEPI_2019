import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';
export default class CustomContextPad {

  constructor(config, contextPad, create, elementFactory, injector, translate) {
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false);
    }

    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
    const {
      autoPlace,
      create,
      elementFactory,
      translate
    } = this;

    function appendServiceTask(event, element) {
      if (autoPlace) {
        const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });
  
        autoPlace.append(element, shape);
      } else {
        appendServiceTaskStart(event, element);
      }
    }

    function appendServiceTaskStart(event) {
      const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });
  
      create.start(event, shape, element);
    }

    function appendUserTask(event, element) {
      if (autoPlace) {
        const shape = elementFactory.createShape({ type: 'bpmn:UserTask' });
  
        autoPlace.append(element, shape);
      } else {
        appendServiceTaskStart(event, element);
      }
    }

    function appendUserTaskStart(event) {
      const shape = elementFactory.createShape({ type: 'bpmn:UserTask' });
  
      create.start(event, shape, element);
    }

    return {
      'append.service-task': {
        group: 'model',
        className: 'bpmn-icon-service-task',
        title: translate('Append ServiceTask'),
        action: {
          click: appendUserTask,
          dragstart: appendUserTaskStart
        }
      },
      'append.user-task': {
        group: 'model',
        className: 'bpmn-icon-user-task',
        title: translate('Append UserTask'),
        action: {
          click: appendServiceTask,
          dragstart: appendServiceTaskStart
        }
      }
    };
  }
}

var _getContextPadEntries = ContextPadProvider.prototype.getContextPadEntries;
ContextPadProvider.prototype.getContextPadEntries = function(element) {
   var entries = _getContextPadEntries.apply(this, [element]);

   delete entries['append.end-event'];
   delete entries['append.gateway'];
   delete entries['append.intermediate-event'];
   delete entries['append.text-annotation'];
   delete entries['append.append-task'];

   delete entries['connect'];
   delete entries['replace'];

   return entries;

}

CustomContextPad.$inject = [
  'config',
  'contextPad',
  'create',
  'elementFactory',
  'injector',
  'translate'
];