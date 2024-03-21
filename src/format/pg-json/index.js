export default {
  name: "PG-JSON",

  direction: "mixed",

  nodeTypes: "*",
  edgeTypes: "*",

  graphAttributes: false,
  nodeAttributes: true,
  edgeAttributes: true,
  visualAttributes: true,

  hierarchy: false,

  datatypes: "JSON scalars",

  // TODO: validate
  parse: string => JSON.parse(string),
  serialize: graph => JSON.stringify(graph, null, 2),
}
