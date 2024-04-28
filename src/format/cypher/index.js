// Cypher CREATE statements

import { parse } from "./parser.js"
import { wrapPeggyParser } from "../../utils.js"

const defaultEdgeType = "edge"
const nodeTypePattern = /./    
const edgeTypePattern = /./
const propertyKeyPattern = /./

const escape = id => /^(\p{ID_Start}|\p{Pc})(\p{ID_Continue}|\p{Sc})*$/u.test(id)
  ? id : "`" + id.replaceAll("`","``") + "`"

// TODO: Cypher differentiates between single value 1 and list of one value [1]
// and it also supports empty collection []!

function valueList(key, values) {
  if (values.length) {
    const type = typeof values[0] // use type of first value as reference
    values = values.filter(v => typeof v === type)
    values = values.map(v => typeof v === "string" ? JSON.stringify(v) : v)
    values = values.length == 1 ? values[0] : "["+values.join(",")+"]"
    if (values !== "") {
      return `${escape(key)}:${values}`
    }
  }
}

function propertyMap(properties) {
  const keys = Object.keys(properties).filter(key => propertyKeyPattern.test(key)).sort()
  const props = keys.map(key => valueList(key, properties[key])).filter(v => v !== undefined)
  if (props.length) {
    return ` {${props.join(", ")}}`
  } else {
    return ""
  }
}

function serializeNode({ id, labels, properties }) {
  labels = labels.filter(label => nodeTypePattern.test(label)).map(l => `:${escape(l)}`).join("")
  return `CREATE (${escape(id)}${labels}${propertyMap(properties)})`
}

function serializeEdge({ from, to, labels, properties }) {
  // edge label is mandatory and non-repeatable
  const type = labels.find(label => edgeTypePattern.test(label)) ?? defaultEdgeType
  return `CREATE (${escape(from)})-[:${escape(type)}${propertyMap(properties)}]->(${escape(to)})`
}

function serialize({ nodes, edges }, warn) {
  const directedEdges = edges.filter(e => !e.undirected)
  warn?.graphReduced({ edges }, { edges: directedEdges }, { edges: "undirected" })
  return [...nodes.map(serializeNode), ...directedEdges.map(serializeEdge)].map(s => s+"\n").join("")
}

export default {
  name: "Cypher CREATE statements",

  direction: "directed",

  nodeTypes: "*", // ?
  edgeTypes: "1",
  edgeIdentifier: false,
  //nodeTypePattern,
  //defaultEdgeType,
  //edgeTypePattern,
  propertyKeyPattern,

  nodeName: false,
  edgeName: false,
  edgeWeight: false,

  graphAttributes: false,
  nodeAttributes: true,
  edgeAttributes: true,
  visualAttributes: false,

  hierarchy: false,
  hyperEdges: false,
  multiEdges: true,

  datatypes: "Cypher data types",

  url: "https://opencypher.org/",
  parse: input => wrapPeggyParser(parse, input),
  serialize
}
