import serialize from "./serializer.js"

export default {
  name: "Meermaid Flowchart (experimental)",
  url: "https://mermaid.js.org/syntax/flowchart.html",

  direction: "mixed",
  edgeAttributes: false,
  edgeIdentifier: false,
  edgeName: true,
  edgeTypes: false,
  graphAttributes: false,
  hierarchy: true,
  hyperEdges: false,
  multiEdges: true,
  nodeAttributes: false,
  nodeName: true,
  nodeTypes: false,
  visualAttributes: true,

  serialize,
}
