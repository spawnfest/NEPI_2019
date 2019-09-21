import BpmnModeler from 'bpmn-js/lib/Modeler';
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';
import customControlsModule from './custom';
import { Shape, Connection } from 'diagram-js/lib/model'

const containerEl = document.getElementById('container');

var _getPaletteEntries = PaletteProvider.prototype.getPaletteEntries;
PaletteProvider.prototype.getPaletteEntries = function(element) {
   var entries = _getPaletteEntries.apply(this);
   console.log(entries);
   delete entries['hand-tool'];
   delete entries['create.data-object'];
   delete entries['create.data-store'];
   delete entries['create.end-event'];
   delete entries['create.exclusive-gateway'];
   delete entries['create.intermediate-event'];
   delete entries['create.participant-expanded'];
   delete entries['create.start-event'];
   delete entries['create.subprocess-expanded'];
   //delete entries['global-connect-tool'];
   delete entries['lasso-tool'];
   delete entries['space-tool'];
   delete entries['tool-separator'];
   delete entries['create.task'];
  //  delete entries[''];
  //  delete entries[''];
  //  delete entries[''];
  //  delete entries[''];

   //delete entries['bpmn-icon-lasso-tool'];
	 //delete entries['create.task'];
	 //delete entries['create.data-store'];
     return entries;

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
   //delete entries['delete'];

   return entries;

}

// create modeler
const bpmnModeler = new BpmnModeler({
  container: containerEl,
  additionalModules: [
    customControlsModule
  ]
});

const xml = `
  <?xml version="1.0" encoding="UTF-8"?>
  <bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">
    <bpmn2:process id="Process_1" isExecutable="false">
      <bpmn2:startEvent id="StartEvent_1"/>
    </bpmn2:process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
      <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">

      </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
  </bpmn2:definitions>`;

// import XML
bpmnModeler.importXML(xml, (err) => {
  if (err) {
    console.error(err);
  }
});

function getData() {
  let canvas = bpmnModeler.get('canvas');
  let shapes = [];
  let elements = canvas._elementRegistry._elements['Process_1'].element.children;

  for (let i = 0; i < elements.length; i++) {
    let element = elements[i];
    if (element instanceof Shape) {
      shapes.push({
        name: element.id,
        children: [],
        type: element.type == "bpmn:UserTask" ? 'supervisor' : 'worker',
        root: true,
      })
    }
  }

  for (let i = 0; i < elements.length; i++) {
    let element = elements[i];
    if (element instanceof Connection) {
      let source = shapes.find(s => s.name == element.source.id);
      let dest = shapes.find(s => s.name == element.target.id);
      source.children.push(dest);
      dest.root = false;
    }
  }
  let data = { data: shapes.filter(s => s.root) };
  return data;
}

window.send = function () {
  document.querySelector('#code-container').innerHTML = "";

  fetch('http://localhost:4000/generate', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(getData())
  })
  .then(res => res.json())
  .then(res => {
    var codeContainer = document.querySelector('#code-container');

    for (let [key, value] of Object.entries(res)) {
      codeContainer.innerHTML += `<div><blockquote><pre><code>${value}</code></pre></blockquote>`;
    }
  });
}


