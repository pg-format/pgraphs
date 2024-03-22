export default {
  name: "PG-JSON",

  direction: "mixed",

  nodeTypes: "*",
  edgeTypes: "*",

  nodeNames: false,
  edgeNames: false,

  graphAttributes: false,
  nodeAttributes: true,
  edgeAttributes: true,
  visualAttributes: false,

  hierarchy: false,
  hyperEdges: false,

  datatypes: "JSON scalars",

  // TODO: validate
  parse: string => JSON.parse(string),
  serialize: graph => JSON.stringify(graph, null, 2),
}
