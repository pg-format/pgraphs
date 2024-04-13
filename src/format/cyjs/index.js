export default {
  name: "Cytoscape.js JSON", 
  //  parse: string => fromCyjs(JSON.parse(string)),
  //  serialize: graph => JSON.stringify(toCyjs(graph), null, 2),
  direction: "directed",    // undirected possible via styles only
  nodeTypes: "*",           // aka classes
  edgeTypes: "*",           // aka classes
  nodeName: "label",
  edgeName: "label",
  edgeIdentifier: true,
  graphAttributes: false,
  nodeAttributes: true,     // except "parent" and "label"
  edgeAttributes: true,     // except "label"
  visualAttributes: true,   // x, y (more possible via stylesheet or special style CSS field)
  // additional special fields for interaction with the element exist (e.g. draggable: true/false)
  hierarchy: true,          // via attribute "parent"
  hyperEdges: false,        // at least not documented
  multiEdges: true,
  datatypes: "JSON",
  url: "http://manual.cytoscape.org/en/stable/Supported_Network_File_Formats.html#cytoscape-js-json"
}
