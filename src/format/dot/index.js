import parse from "./parser.js"
import serialize from "./serializer.js"

export default {
  name: "GraphViz DOT",

  direction: "uniform",

  nodeTypes: false,
  edgeTypes: false,

  graphAttributes: true,
  hierarchy: true,

  visualAttributes: true,

  parse, serialize
}
