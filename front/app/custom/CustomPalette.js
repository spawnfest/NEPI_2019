export default class CustomPalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const {
      bpmnFactory,
      create,
      elementFactory,
      translate
    } = this;

    function createServiceTask(event) {
      const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });

      create.start(event, shape);
    }

    function createUserTask(event) {
      const shape = elementFactory.createShape({ type: 'bpmn:UserTask'});

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