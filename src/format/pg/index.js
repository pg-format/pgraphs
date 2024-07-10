import profile from "./profile.js"
import { serialize } from "./serialize.js"
import { parse } from "./parser.js"
import { wrapPeggyParser } from "../../utils.js"

export default {
  ...profile,
  parse: input => wrapPeggyParser(parse, input),
  serialize
}
