import serialize from "./serialize.js"

// https://neo4j.com/docs/operations-manual/current/tutorial/neo4j-admin-import/
// https://docs.aws.amazon.com/neptune/latest/userguide/bulk-load-tutorial-format-opencypher.html

export default {
  name: "OpenCypher/Neo4J CSV files",

  datatypes: "true",
  direction: "directed",
  edgeAttributes: true,
  edgeIdentifier: true,
  edgeName: false,
  edgeTypes: "1",
  graphAttributes: false,
  hierarchy: false,
  hyperEdges: false,
  loops: true,
  multiEdges: true,
  nodeAttributes: true,
  nodeName: false,
  nodeTypes: "*",
  visualAttributes: false,

  serialize,
}
