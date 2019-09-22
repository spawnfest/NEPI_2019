import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
export default class CustomPalette {
  
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;
    this.workersCount = 0;
    this.supervisorsCount = 0;

    palette.registerProvider(this);
  }


  getPaletteEntries(element) {
    let {
      bpmnFactory,
      create,
      elementFactory,
      translate,
      workersCount,
      supervisorsCount,
    } = this;
    

    function createServiceTask(event) {
      const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });
      shape.businessObject.name = `Worker ${workersCount++}`;
      create.start(event, shape);
    }

    function createUserTask(event) {
      const shape = elementFactory.createShape({ type: 'bpmn:UserTask'});
      shape.businessObject.name = `Supervisor ${supervisorsCount++}`;
      create.start(event, shape);
    }

    return {
      'create.service-task': {
        group: 'activity',
        className: 'bpmn-icon-service-task',
        title: translate('Create ServiceTask'),
        action: {
          dragstart: createServiceTask,
          click: createServiceTask
        }
      },
      'create.user-task': {
        group: 'activity',
        className: 'bpmn-icon-user-task',
        title: translate('Create UserTask'),
        action: {
          dragstart: createUserTask,
          click: createUserTask
        }
      },
    }
  }
}

var _getPaletteEntries = PaletteProvider.prototype.getPaletteEntries;
PaletteProvider.prototype.getPaletteEntries = function(element) {
   var entries = _getPaletteEntries.apply(this);
   delete entries['create.group'];
   delete entries['hand-tool'];
   delete entries['create.data-object'];
   delete entries['create.data-store'];
   delete entries['create.end-event'];
   delete entries['create.exclusive-gateway'];
   delete entries['create.intermediate-event'];
   delete entries['create.participant-expanded'];
   delete entries['create.start-event'];
   delete entries['create.subprocess-expanded'];
   delete entries['lasso-tool'];
   delete entries['space-tool'];
   delete entries['tool-separator'];
   delete entries['create.task'];

   return entries;
}


CustomPalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate',
];