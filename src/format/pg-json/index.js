export default {
  name: "PG-JSON",

  direction: "mixed",

  nodeTypes: "*",
  edgeTypes: "*",

  graphAttributes: false,

  hierarchy: false,

  datatypes: "JSON scalars",

  // TODO: validate
  parse: string => JSON.parse(string),
  serialize: graph => JSON.stringify(graph, null, 2),
}
