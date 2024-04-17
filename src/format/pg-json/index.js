function parse(string) {
  const graph = JSON.parse(string)
  // TODO: validate!
  // - Disallow repeated edge identifiers
  // 
  return graph
}

export default {
  name: "PG-JSON",

  datatypes: "string|number",
  direction: "mixed",
  edgeAttributes: true,
  edgeIdentifier: true,
  edgeName: false,
  edgeTypes: "*",
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
