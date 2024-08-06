import { escape, serializeProperties, serializeNode, serializeEdge } from "../cypher/serialize.js"

export function serialize({ nodes, edges }, { warn, id, merge } = {}) {
  if ((id || "") === "") {throw new Error("Missing option: id")}

  const directedEdges = edges.filter(e => !e.undirected)
  warn?.graphReduced({ edges }, { edges: directedEdges }, { edges: "undirected" })

  const edgeStm = edge => {
    const create = serializeEdge({ ...edge, from: "a", to: "b" }, merge)
    const a = {[id]: [edge.from]}
    const b = {[id]: [edge.to]}
    // TODO: include edge id if given to merge edges
    return `MATCH (a${serializeProperties(a)}), (b${serializeProperties(b)}) ${create};`
  }

  const nodeStm = node => {
    // TODO: warn if property is overridden
    const idProperty = { [id]: [node.id] }
    const properties = {...node.properties, ...idProperty }
  
    if (merge) {
      const stm = serializeNode({ id: "n", labels: [], properties: idProperty }, true)
      var set = "SET n =" + serializeProperties(properties)
      if (node.labels.length) {
        // TODO: this will keep existing labels!
        // see https://github.com/neo4j/neo4j/issues/2073
        // and https://stackoverflow.com/questions/75750819/update-neo4j-node-labels-via-cypher
        set += ", n" + node.labels.map(l => `:${escape(l)}`).join("")
      }
      return `${stm} ${set};`
    } else {
      return serializeNode({ labels: node.labels, properties }) + ";"
    }
  }

  return [
    ...nodes.map(nodeStm),
    ...directedEdges.map(edgeStm)
  ].map(s => s+"\n").join("")
}
