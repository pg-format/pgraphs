import cypher from "../cypher/index.js"
import parse from "./parser.js"

export default {
  ...cypher,
  name: "Neo4J database (via Cypher query)",
  parse,
  serialize: undefined,
  url: undefined,
}
