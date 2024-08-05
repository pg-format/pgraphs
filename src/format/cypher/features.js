export default {
  name: "Cypher CREATE statements",

  direction: "directed",

  nodeTypes: "*", // ?
  edgeTypes: "1",
  edgeIdentifier: false,

  // TODO:
  //nodeTypePattern = /./,
  //defaultEdgeType = "edge",
  //edgeTypePattern = /./,
  propertyKeyPattern: /./,

  nodeName: false,
  edgeName: false,
  edgeWeight: false,

  graphAttributes: false,
  nodeAttributes: true,
  edgeAttributes: true,
  visualAttributes: false,

  hierarchy: false,
  hyperEdges: false,
  multiEdges: true,

  datatypes: "Cypher data types",

  url: "https://opencypher.org/",
}
