import parse from "./parser.js"
import serialize from "./serializer.js"

export default {
  name: "GraphViz DOT",

  direction: "uniform",

  nodeTypes: false,
  edgeTypes: false,

  graphAttributes: true,
  subgraphs: true,
  datatypes: "string",

  visualAttributes: true,

  parse, serialize
}
