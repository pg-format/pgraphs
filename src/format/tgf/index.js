import parse from "./parser.js"
import serialize from "./serializer.js"

export default {
  name: "Trivial Graph Format",

  direction: "directed",

  nodeTypes: false,
  edgeTypes: false,

  nodeLabels: "0/1",
  edgeLabels: "0/1",

  graphAttributes: false,
  nodeAttributes: false,
  edgeAttributes: false,
  visualAttributes: false,

  hierarchy: false,

  parse, serialize
}
