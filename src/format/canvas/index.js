import parse from "./parse.js"
import serialize from "./serialize.js"

export default {
  name: "JSON Canvas (experimental)",

  direction: "directed",

  nodeTypes: false,
  edgeTypes: false,
  edgeWeight: false,

  nodeName: "text",
  edgeName: "label",
  edgeIdentifier: true,

  graphAttributes: false,
  nodeAttributes: false,
  edgeAttributes: false,
  visualAttributes: true,

  hierarchy: true,
  hyperEdges: false,
  multiEdges: true, // ?

  datatypes: false,

  url: "https://jsoncanvas.org/",
  serialize,
  parse,
}

