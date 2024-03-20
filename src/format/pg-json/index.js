export default {
  name: "PG-JSON",

  direction: "mixed",

  nodeTypes: "0..*",
  edgeTypes: "0..*",

  graphAttributes: false,

  subgraphs: false,

  datatypes: "json scalar",

  // TODO: validate
  parse: string => JSON.parse(string),
  serialize: graph => JSON.stringify(graph, null, 2),
}
