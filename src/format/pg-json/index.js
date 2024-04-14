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

  // TODO: validate
  parse: string => JSON.parse(string),
  serialize: graph => JSON.stringify(graph, null, 2),
}
