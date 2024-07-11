import features from "./features.js"
import { parse } from "./parse.js"

export default {
  ...features,
  parse,
  serialize: graph => JSON.stringify(graph, null, 2),
}
