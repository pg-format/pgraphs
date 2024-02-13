export default graph => {
  const lines = []
  // TODO: add 'type to support import in Neo4J?
  for (let node of graph.nodes) {
    lines.push(JSON.stringify(node))
  }
  for (let edge of graph.edges) {
    lines.push(JSON.stringify(edge))
  }
  return lines.join("\n")+"\n"
}
