import { serialize } from "./serializer.js"
import { parse } from "./parser.js"
import { wrapPeggyParser } from "../../utils.js"

export default {
  name: "PG format",

  direction: "mixed",

  nodeTypes: "*",
  edgeTypes: "*",

  nodeName: false,
  edgeName: false,
  edgeIdentifier: true,

  graphAttributes: false,
  nodeAttributes: true,
  edgeAttributes: true,
  visualAttributes: false,

  hierarchy: false,
  hyperEdges: false,
  multiEdges: true,

  datatypes: "JSON scalars",

  url: "https://github.com/pg-format/specification",
  parse: input => wrapPeggyParser(parse, input),
  serialize
}
