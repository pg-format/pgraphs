import features from "../cypher/features.js"
import { parse, serialize } from "./connect.js"

export default {
  ...features,
  name: "Neo4J database (via Cypher query)",
  parse,
  serialize,
  url: undefined,
}
