import { serialize } from "./serializer.js"
import { parse } from "./parser.js"
import { wrapPeggyParser } from "../../utils.js"

export default {
  name: "PG format",

  datatypes: "string|number",
  direction: "mixed",
  edgeAttributes: true,
  edgeIdentifier: true,
  edgeName: false,
  edgeTypes: "*",
  edgeWeight: false,
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
  parse: input => wrapPeggyParser(parse, input),
  serialize
}
