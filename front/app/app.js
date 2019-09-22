import BpmnModeler from 'bpmn-js/lib/Modeler';
import customControlsModule from './custom';
import { Shape, Connection } from 'diagram-js/lib/model'

const containerEl = document.getElementById('container');

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
      if (element.type == "bpmn:UserTask" && element.outgoing.length === 0)
      {
        alert("Supervisors needs workers");

        return null;
      }

      if (element.type == "bpmn:ServiceTask" && element.incoming.length === 0)
      {
        alert("Workers needs supervisors");

        return null;
      }

      shapes.push({
        id: element.id,
        name: element.businessObject.name || element.id,
        children: [],
        type: element.type == "bpmn:UserTask" ? 'supervisor' : 'worker',
        root: true,
      })
    }
  }

  for (let i = 0; i < elements.length; i++) {
    let element = elements[i];
    if (element instanceof Connection) {
      let source = shapes.find(s => s.id == element.source.id);
      let dest = shapes.find(s => s.id == element.target.id);
      source.children.push(dest);
      dest.root = false;
    }
  }

  return { data: shapes.filter(s => s.root) };
}

window.send = function () {
  var data = getData();

  if (data === null)
    return;

  document.querySelector('#code-container').innerHTML = "";

  fetch('http://localhost:4000/generate', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(res => {
    var codeContainer = document.querySelector('#code-container');

    for (let [key, value] of Object.entries(res)) {
      codeContainer.innerHTML += `<div><blockquote><pre><code>${value}</code></pre></blockquote>`;
    }
  });
}


