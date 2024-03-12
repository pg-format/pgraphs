import { serialize } from "./serializer.js"
import { parse } from "./parser.js"

export default {
  name: "PG format",

  nodeLabels: "0..*",
  edgeLabels: "0..*",
  direction: "mixed",
  graphAttributes: false,
  subgraphs: false,
  datatypes: "json scalar",

  parse(text) {
    try {
      return parse(text) 
    } catch (e) {
      var msg = e.message
      if (e.location) {
        const { line, column } = e.location.start
        msg += ` Line ${line}:${column}.`
      }
      throw new Error(msg)
    }
  },

  serialize
}
