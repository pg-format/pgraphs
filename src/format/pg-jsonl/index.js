import parse from "./parser.js"
import serialize from "./serializer.js"

export default {
  name: "PG-JSONL",

  datatypes: "string|number",
  direction: "mixed",
  edgeAttributes: true,
  edgeIdentifier: true,
  edgeName: false,
  edgeTypes: "*",
  graphAttributes: false,
  hierarchy: false,
  hyperEdges: false,
  loops: true,
  multiEdges: true,
  nodeAttributes: true,
  nodeName: false,
  nodeTypes: "*",
  visualAttributes: false,

  url: "https://github.com/pg-format/specification",
  parse,
  serialize
}
