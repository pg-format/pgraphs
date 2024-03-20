import parse from "./parser.js"
import serialize from "./serializer.js"

export default {
  name: "Trivial Graph Format",

  direction: "directed",

  nodeTypes: "0..1", // TODO: use label instead
  edgeTypes: "0..1",

  subgraphs: false,

  parse, serialize
}
