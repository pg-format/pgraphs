import serialize from "./serializer.js"

export default {
  name: "YARS-PG",
  direction: "mixed",

  nodeTypes: false,
  edgeTypes: false,
  nodeName: false,
  edgeName: false,
  edgeIdentifier: true, // optional
  edgeWeight: false,

  graphAttributes: true, // TODO: graph labels are possible too!

  nodeAttributes: true,
  edgeAttributes: true,
  visualAttributes: false,

  hierarchy: false,
  hyperEdges: false,

  // TODO: nodes and edges can be assignde to mutliple graphs
  // TODO: metadata and meta-properties

  // types are supported via schema only
  // datatypes: ...

  url: "https://github.com/lszeremeta/yarspg?tab=readme-ov-file#yars-pg-grammar",
  serialize
}
