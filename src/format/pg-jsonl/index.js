import parse from "./parser.js"
import serialize from "./serializer.js"

export default {
  name: "PG-JSONL",

  nodeLabels: "0..*",
  edgeLabels: "0..*",
  direction: "mixed",
  graphAttributes: false,
  subgraphs: false,
  datatypes: "json scalar",

  parse, serialize
}
