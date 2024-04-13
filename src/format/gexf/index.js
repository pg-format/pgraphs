// import serialize from "./serializer.js"

export default {
  name: "Graph Exchange XML Format (GEXF)",

  nodeTypes: false,
  edgeTypes: false,

  nodeName: true,       // special attribute
  edgeName: true,       // special attribute
  edgeIdentifier: true,

  direction: "mixed",
  graphAttributes: true,
  hierarchy: "multi",
  hyperEdges: false,

  visualAttributes: true,
  // specialNodeAttributes: ["label","color","position","shape","size"],
  // specialEdgeAttributes: ["weight","color","thickness","shape"],
  //dynamic: true,

  url: "https://gexf.net/",
  // serialize
}
