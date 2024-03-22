import parse from "./parser.js"
import serialize from "./serializer.js"

export default {
  name: "PG-JSONL",

  direction: "mixed",

  nodeTypes: "*",
  edgeTypes: "*",

  nodeNames: false,
  edgeNames: false,

  graphAttributes: false,
  nodeAttributes: true,
  edgeAttributes: true,
  visualAttributes: false,

  hierarchy: false,
  hyperEdges: false,

  datatypes: "JSON scalars",

  parse, serialize
}
