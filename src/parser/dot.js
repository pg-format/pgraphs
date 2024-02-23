import dotparser from "dotparser"
import { graph } from "../utils.js"

/**
 * Parse and convert DOT to PG.
 * Graph attributes and subgraphs are ignored.
 */
export default (string) => {
  const nodes = {}, edges = []

  const dot = dotparser(string)?.[0] || {}
  const undirected = dot.type == "graph"
  const children = dot.children || []

  // DOT does not have note labels in the sense of PG
  const labels = []

  for (let { type, attr_list, node_id, edge_list } of children) {
    // properties can be strings or numbers
    const properties = Object.fromEntries((attr_list||[]).map(({id,eq}) => [id,[eq]]))
    if (type == "node_stmt") {
      // same node id overrides existing node (FIXME?)
      const id = node_id.id
      nodes[id] = { id, labels, properties }
    } else if (type == "edge_stmt") {
      const edge = {
        from: edge_list[0].id,
        to: edge_list[1].id,
        labels,
        properties,
      }
      if (undirected) {
        edge.undirected = true
      }
      edges.push(edge)
    }
  }

  return graph(nodes, edges)
}
