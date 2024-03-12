export default {
  name: "PG-JSON",

  nodeLabels: "0..*",
  edgeLabels: "0..*",
  direction: "mixed",
  graphAttributes: false,
  subgraphs: false,
  datatypes: "json scalar",

  // TODO: validate
  parse: string => JSON.parse(string),
  serialize: graph => JSON.stringify(graph, null, 2),
}
