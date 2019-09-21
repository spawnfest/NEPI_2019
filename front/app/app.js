import Diagram from 'diagram-js/lib/Diagram';

import ConnectModule from 'diagram-js/lib/features/connect';
import ContextPadModule from 'diagram-js/lib/features/context-pad';
import CreateModule from 'diagram-js/lib/features/create';
import LassoToolModule from 'diagram-js/lib/features/lasso-tool';
import ModelingModule from 'diagram-js/lib/features/modeling';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import MoveModule from 'diagram-js/lib/features/move';
import OutlineModule from 'diagram-js/lib/features/outline';
import PaletteModule from 'diagram-js/lib/features/palette';
import ResizeModule from 'diagram-js/lib/features/resize';
import RulesModule from 'diagram-js/lib/features/rules';
import SelectionModule from 'diagram-js/lib/features/selection';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';

import ExampleContextPadProvider from './ExampleContextPadProvider';
import ExamplePaletteProvider from './ExamplePaletteProvider';
import ExampleRuleProvider from './ExampleRuleProvider';

import { Shape, Connection } from 'diagram-js/lib/model'

import BpmnJS from 'bpmn-js';
console.log(BpmnJS);

var ExampleModule = {
  __init__: [
    'exampleContextPadProvider',
    'examplePaletteProvider',
    'exampleRuleProvider'
  ],
  exampleContextPadProvider: [ 'type', ExampleContextPadProvider ],
  examplePaletteProvider: [ 'type', ExamplePaletteProvider ],
  exampleRuleProvider: [ 'type', ExampleRuleProvider ]
};

var container = document.querySelector('#container');

var diagram = new Diagram({
  canvas: {
    container: container
  },
  modules: [
    ConnectModule,
    ContextPadModule,
    CreateModule,
    ExampleModule,
    LassoToolModule,
    ModelingModule,
    MoveCanvasModule,
    MoveModule,
    OutlineModule,
    PaletteModule,
    ResizeModule,
    RulesModule,
    SelectionModule,
    ZoomScrollModule
  ]
});

var defaultRenderer = diagram.get('defaultRenderer');

// override default styles
defaultRenderer.CONNECTION_STYLE = { fill: 'none', strokeWidth: 5, stroke: '#74949c' };
defaultRenderer.SHAPE_STYLE = { fill: '#81beb2', strokeWidth: 0 };
defaultRenderer.FRAME_STYLE = { fill: '#536c8c', strokeWidth: 0 };

function getData() {
  let canvas = diagram.get('canvas');
  let shapes = [];

  for (let [key, value] of Object.entries(canvas._elementRegistry._elements)) {
    if (value.element instanceof Shape) {
      shapes.push({
        name: key,
        children: [],
        type: value.element.isFrame ? 'supervisor' : 'worker'
      })
    }
  }

  for (let [key, value] of Object.entries(canvas._elementRegistry._elements)) {
    if (value.element instanceof Connection) {
      let source = shapes.find(s => s.name == value.element.source.id);
      let dest = shapes.find(s => s.name == value.element.target.id);
      source.children.push(dest);
    }
  }
  
  return shapes.length > 0 ? shapes[0] : null;
}

window.send = function () {
  fetch('http://localhost:4000/generate', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(getData())
  })
  .then(res => res.json())
  .then(res => console.log(res));
}