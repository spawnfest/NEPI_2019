import Diagram from '../..';

import ConnectModule from '../../lib/features/connect';
import ContextPadModule from '../../lib/features/context-pad';
import CreateModule from '../../lib/features/create';
import LassoToolModule from '../../lib/features/lasso-tool';
import ModelingModule from '../../lib/features/modeling';
import MoveCanvasModule from '../../lib/navigation/movecanvas';
import MoveModule from '../../lib/features/move';
import OutlineModule from '../../lib/features/outline';
import PaletteModule from '../../lib/features/palette';
import ResizeModule from '../../lib/features/resize';
import RulesModule from '../../lib/features/rules';
import SelectionModule from '../../lib/features/selection';
import ZoomScrollModule from '../../lib/navigation/zoomscroll';

import ExampleContextPadProvider from './ExampleContextPadProvider';
import ExamplePaletteProvider from './ExamplePaletteProvider';
import ExampleRuleProvider from './ExampleRuleProvider';

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

new Diagram({
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