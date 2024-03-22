import parse from "./parser.js"
import serialize from "./serializer.js"

export default {
  name: "Trivial Graph Format",

  direction: "directed",

  nodeTypes: false,
  edgeTypes: false,

  nodeNames: "0/1",
  edgeNames: "0/1",

  graphAttributes: false,
  nodeAttributes: false,
  edgeAttributes: false,
  visualAttributes: false,

  hierarchy: false,
  hyperEdges: false,
  datatypes: false,

  parse, serialize
}
