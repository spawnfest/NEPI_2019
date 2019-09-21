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

  return {
    'create-worker': {
      group: 'create',
      className: 'palette-icon-create-shape',
      title: 'Create Worker',
      action: {
        click: function() {
          var shape = elementFactory.createShape({
            width: 80,
            height: 80
          });

          create.start(event, shape);
        }
      }
    },
    'create-supervisor': {
      group: 'create',
      className: 'palette-icon-create-frame',
      title: 'Create Supervisor',
      action: {
        click: function() {
          var shape = elementFactory.createShape({
            width: 120,
            height: 40,
            isFrame: true
          });

          create.start(event, shape);
        }
      }
    }
  };
};