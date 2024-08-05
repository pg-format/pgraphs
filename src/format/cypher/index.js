// Cypher CREATE statements

import features from "./features.js"
import { serialize } from "./serialize.js"
import { parse } from "./parser.js"
import { wrapPeggyParser } from "../../utils.js"

export default {
  ...features,
  parse: input => wrapPeggyParser(parse, input),
  serialize
}
