import { serialize } from "./serializer.js"
import { parse } from "./parser.js"
import { wrapPeggyParser } from "../../utils.js"

export default {
  name: "PG format",

  direction: "mixed",

  nodeTypes: "0..*",
  edgeTypes: "0..*",

  graphAttributes: false,

  subgraphs: false,

  datatypes: "json scalar",

  parse: input => wrapPeggyParser(parse, input),
  serialize
}
