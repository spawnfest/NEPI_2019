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

CustomPalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate',
];