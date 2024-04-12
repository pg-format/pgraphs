import parse from "./parser.js"
import serialize from "./serializer.js"

export default {
  name: "GraphViz DOT",

  direction: "uniform",

  nodeTypes: false,
  edgeTypes: false,

  nodeName: "label",
  edgeName: "label",
  edgeIdentifier: false,

  graphAttributes: true,
  nodeAttributes: true,
  edgeAttributes: true,
  visualAttributes: true, // TODO: subset of all attributes

  hierarchy: true,
  hyperEdges: false,
  multiEdges: true,

  url: "https://graphviz.org/doc/info/lang.html",
  parse, serialize
}
