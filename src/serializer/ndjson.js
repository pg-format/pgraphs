export default graph => {
  const lines = []
  // TODO: add 'type to support import in Neo4J?
  for (const node of graph.nodes) {
    lines.push(JSON.stringify(node))
  }
  for (const edge of graph.edges) {
    lines.push(JSON.stringify(edge))
  }
  return lines.join("\n") + "\n"
}
