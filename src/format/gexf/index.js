import serialize from "./serializer.js"

export default {
  name: "Graph Exchange XML Format (GEXF)",

  direction: "mixed",
  edgeAttributes: true,
  edgeIdentifier: true,
  edgeName: "label",
  edgeTypes: false,
  edgeWeight: true,     // double. default: 1
  graphAttributes: true,
  hierarchy: "multi",
  hyperEdges: false,
  nodeAttributes: true,  
  nodeName: "label",
  nodeTypes: false,

  visualAttributes: true, 
  // visualNodeAttributes: color, position, shape, size
  // visualEdgeAttributes: color, thickness, shape
    
  //dynamic: true,

  url: "https://gexf.net/",
  parse: undefined,
  serialize
}
