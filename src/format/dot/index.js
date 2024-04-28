import parse from "./parser.js"
import serialize from "./serializer.js"

export default {
  name: "GraphViz DOT",

  direction: "uniform",
  edgeAttributes: true,
  edgeIdentifier: false,
  edgeName: "label",
  edgeTypes: false,
  edgeWeight: true, // integer (1,2,3...), default: 1
  graphAttributes: true,
  hierarchy: true,
  hyperEdges: false,
  multiEdges: true,
  nodeAttributes: true,
  nodeName: "label",
  nodeTypes: false,
  visualAttributes: true, // TODO: subset of all attributes

  url: "https://graphviz.org/doc/info/lang.html",
  parse, serialize
}
