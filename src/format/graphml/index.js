import serialize from "./serializer.js"

export default {
  name: "GraphML",

  direction: "uniform",

  nodeTypes: false,
  edgeTypes: false,

  graphAttributes: true,
  subgraphs: true,

  hyperEdges: true,

  serialize
}
