import CustomContextPad from './CustomContextPad';
import CustomPalette from './CustomPalette';
import CustomRules from './CustomRules';

export default {
  __init__: [ 'customContextPad', 'customPalette', 'customRules' ],
  customContextPad: [ 'type', CustomContextPad ],
  customPalette: [ 'type', CustomPalette ],
  customRules: [ 'type', CustomRules ]
};