/**
 * A example palette provider.
 */
export default function ExamplePaletteProvider(create, elementFactory, lassoTool, palette) {
  this._create = create;
  this._elementFactory = elementFactory;
  this._lassoTool = lassoTool;
  this._palette = palette;

  palette.registerProvider(this);
}

ExamplePaletteProvider.$inject = [
  'create',
  'elementFactory',
  'lassoTool',
  'palette'
];


ExamplePaletteProvider.prototype.getPaletteEntries = function() {
  var create = this._create,
      elementFactory = this._elementFactory,
      lassoTool = this._lassoTool;

  return {
    'lasso-tool': {
      group: 'tools',
      className: 'palette-icon-lasso-tool',
      title: 'Activate Lasso Tool',
      action: {
        click: function(event) {
          lassoTool.activateSelection(event);
        }
      }
    },
    'tool-separator': {
      group: 'tools',
      separator: true
    },
    'create-worker': {
      group: 'create',
      className: 'palette-icon-create-shape',
      title: 'Create Worker',
      action: {
        click: function() {
          var shape = elementFactory.createShape({
            width: 100,
            height: 80
          });

          create.start(event, shape);
        }
      }
    },
    'create-supervisor': {
      group: 'create',
      className: 'palette-icon-create-shape',
      title: 'Create Supervisor',
      action: {
        click: function() {
          var shape = elementFactory.createShape({
            width: 300,
            height: 200
          });

          create.start(event, shape);
        }
      }
    }
  };
};