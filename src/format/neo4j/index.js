import cypher from "../cypher/index.js"
import { parse, serialize } from "./connect.js"

export default {
  ...cypher,
  name: "Neo4J database (via Cypher query)",
  parse,
  serialize,
  url: undefined,
}
