import serialize from "./serializer.js"

export default {
  name: "Meermaid Flowchart (experimental)",
  url: "https://mermaid.js.org/syntax/flowchart.html",

  direction: "mixed",
  edgeAttributes: false,
  edgeIdentifier: false,
  edgeName: "name", 
  edgeTypes: false,
  edgeWeight: false, // but planned, see https://github.com/mermaid-js/mermaid/issues/1736
  graphAttributes: false,
  hierarchy: true,
  hyperEdges: false,
  multiEdges: true,
  nodeAttributes: false,
  nodeName: "name",
  nodeTypes: false,
  visualAttributes: true,

  serialize,
}
