import profile from "./profile.js"
import { parse } from "./parse.js"

export default {
  ...profile,
  parse,
  serialize: graph => JSON.stringify(graph, null, 2),
}
