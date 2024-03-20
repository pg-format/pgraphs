import serialize from "./serializer.js"

export default {
  name: "GraphML",

  direction: "uniform",

  nodeTypes: false,
  edgeTypes: false,

  graphAttributes: true,
  hierarchy: true,

  hyperEdges: true,

  serialize
}
