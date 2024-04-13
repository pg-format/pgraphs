// Serialize PG-JSONL (with sorted keys for stable result)

const sorted = obj => Object.fromEntries(Object.keys(obj).sort().map(key => [key, obj[key]]))

export default graph => {
  const lines = []
  for (const {id, labels, properties} of graph.nodes) {
    const node = { type: "node", id, labels, properties: sorted(properties) }
    lines.push(JSON.stringify(node))
  }
  for (const {id, from, to, labels, properties, undirected} of graph.edges) {
    const edge = { type: "edge", from, to, labels, properties: sorted(properties) }
    if (undirected) { edge.undirected = true }
    if (id) { edge.id = id }
    lines.push(JSON.stringify(edge))
  }
  return lines.join("\n") + "\n"
}
