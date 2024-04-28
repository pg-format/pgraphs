import { ParsingError } from "../../error.js"

function parse(string) {
  var { nodes, edges } = JSON.parse(string)
  nodes ??= []
  edges ??= []

  const nodeIds = new Set()
  for (let node of nodes) {
    if (nodeIds.has(node.id)) {
      throw new ParsingError(`Repeated node identifier "${node.id}"`)
    }
    nodeIds.add(node.id)
  }
  
  const edgeIds = new Set()
  for (let edge of edges) {
    if (edgeIds.has(edge.id)) {
      throw new ParsingError(`Repeated edge identifier "${edge.id}"`)
    }
    // add implicit nodes
    if (!nodeIds.has(edge.from)) {
      nodes.push({ id: edge.from, labels: [], properties: {} })
    }
    if (!nodeIds.has(edge.to)) {
      nodes.push({ id: edge.to, labels: [], properties: {} })
    }
    if (edge.id) {
      edgeIds.add(edge.id)
    }
  }

  return { nodes, edges }
}

export default {
  name: "PG-JSON",

  datatypes: "string|number",
  direction: "mixed",
  edgeAttributes: true,
  edgeIdentifier: true,
  edgeName: false,
  edgeTypes: "*",
  edgeWeight: false,
  graphAttributes: false,
  hierarchy: false,
  hyperEdges: false,
  loops: true,
  multiEdges: true,
  nodeAttributes: true,
  nodeName: false,
  nodeTypes: "*",
  visualAttributes: false,

  url: "https://github.com/pg-format/specification",

  parse,
  serialize: graph => JSON.stringify(graph, null, 2),
}
