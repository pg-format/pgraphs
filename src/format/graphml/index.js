import serialize from "./serializer.js"

export default {
  name: "GraphML",

  nodeLabels: "0",
  edgeLabels: "0",
  direction: "uniform",
  graphAttributes: true,
  subgraphs: true,
  hyperEdges: true,

  serialize
}
