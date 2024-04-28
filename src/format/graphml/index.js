import serialize from "./serializer.js"

export default {
  name: "GraphML",

  direction: "mixed",

  nodeTypes: false,
  edgeTypes: false,
  nodeName: false,
  edgeName: false,
  edgeIdentifier: true,
  edgeWeight: false,     // but it's recommended to use edge attributes

  graphAttributes: true,
  nodeAttributes: true,
  edgeAttributes: true,
  visualAttributes: false,

  hierarchy: true,
  hyperEdges: true,

  datatypes: "bool|int|long|float|double|string",

  url: "http://graphml.graphdrawing.org/",
  serialize
}
