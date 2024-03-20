import parse from "./parser.js"
import serialize from "./serializer.js"

export default {
  name: "PG-JSONL",

  direction: "mixed",

  nodeTypes: "0..*",
  edgeTypes: "0..*",

  graphAttributes: false,

  subgraphs: false,

  datatypes: "json scalar",

  parse, serialize
}
