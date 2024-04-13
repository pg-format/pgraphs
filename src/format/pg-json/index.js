export default {
  name: "PG-JSON",

  direction: "mixed",

  nodeTypes: "*",
  edgeTypes: "*",

  nodeName: false,
  edgeName: false,
  edgeIdentifier: true,

  graphAttributes: false,
  nodeAttributes: true,
  edgeAttributes: true,
  visualAttributes: false,

  hierarchy: false,
  hyperEdges: false,
  multiEdges: true,

  datatypes: "JSON scalars",

  url: "https://github.com/pg-format/specification",

  // TODO: validate
  parse: string => JSON.parse(string),
  serialize: graph => JSON.stringify(graph, null, 2),
}
