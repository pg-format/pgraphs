import serialize from "./serializer.js"

export default {
  name: "GraphML",

  direction: "mixed",

  nodeTypes: false,
  edgeTypes: false,
  nodeNames: false,
  edgeNames: false,

  graphAttributes: true,
  nodeAttributes: true,
  edgeAttributes: true,
  visualAttributes: false,

  hierarchy: true,
  hyperEdges: true,

  datatypes: "bool|int|long|float|double|string",

  serialize
}
