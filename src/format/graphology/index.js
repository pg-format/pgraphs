import { parse, fromGraphology } from "./parse.js"
import { serialize, toGraphology } from "./serialize.js"

export { fromGraphology, toGraphology }

export default {
  name: "Graphology import/export",

  datatypes: "JSON",
  direction: "mixed",
  edgeAttributes: true,
  edgeIdentifier: true,
  edgeName: false,
  edgeTypes: false,
  edgeWeight: false,
  graphAttributes: true,
  hierarchy: false,
  hyperEdges: false,
  multiEdges: true,
  nodeAttributes: true,
  nodeName: false,
  nodeTypes: false,
  visualAttributes: false,

  parse,
  serialize,
  url: "https://graphology.github.io/serialization.html",
}
