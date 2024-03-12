import parse from "./parser.js"
import serialize from "./serializer.js"

export default {
  name: "GraphViz DOT",

  nodeLabels: "0",
  edgeLabels: "0",
  direction: "uniform",
  graphAttributes: true,
  subgraphs: true,
  datatypes: "string",

  parse, serialize
}
