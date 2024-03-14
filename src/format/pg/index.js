import { serialize } from "./serializer.js"
import { parse } from "./parser.js"
import { wrapPeggyParser } from "../../utils.js"

export default {
  name: "PG format",

  nodeLabels: "0..*",
  edgeLabels: "0..*",
  direction: "mixed",
  graphAttributes: false,
  subgraphs: false,
  datatypes: "json scalar",

  parse: input => wrapPeggyParser(parse, input),
  serialize
}
