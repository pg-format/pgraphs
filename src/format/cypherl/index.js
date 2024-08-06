import features from "../cypher/features.js"
import { serialize } from "./serialize.js"

export default {
  ...features,
  name: "CYPHERL (one query per line, requires id property)",
  serialize,
  url: "https://memgraph.com/docs/data-migration/cypherl"
}
