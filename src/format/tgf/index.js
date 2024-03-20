import parse from "./parser.js"
import serialize from "./serializer.js"

export default {
  name: "Trivial Graph Format",

  direction: "directed",

  nodeLabels: "0/1",
  edgeLabels: "0/1",

  hierarchy: false,

  parse, serialize
}
