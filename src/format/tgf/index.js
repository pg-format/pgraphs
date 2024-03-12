import parse from "./parser.js"
import serialize from "./serializer.js"

export default {
  name: "Trivial Graph Format",

  nodeLabels: "0..1",
  edgeLabels: "0..1",
  direction: "directed",
  graphAttributes: false,
  subgraphs: false,

  parse, serialize
}
