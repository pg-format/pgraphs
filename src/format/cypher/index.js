// Cypher CREATE statements

import { parse } from "./parser.js"
import { wrapPeggyParser } from "../../utils.js"

const defaultEdgeLabel = "edge"
const nodeLabelPattern = /./    
const edgeLabelPattern = /./
const propertyKeyPattern = /./

const escape = id => /^(\p{ID_Start}|\p{Pc})(\p{ID_Continue}|\p{Sc})*$/u.test(id)
  ? id : "`" + id.replaceAll("`","``") + "`"

// TODO: Cypher differentiates between single value 1 and list of one value [1]
// and it also supports empty collection []!

function valueList(values) {
  // filter out null values and mixed typed values
  values = values.filter(v => v !== null)
  if (values.length) {
    const type = typeof values[0]
    values = values.filter(v => typeof v === type)
  }
  values = values.map(v => typeof v === "string" ? JSON.stringify(v) : v)
  return values.length == 1 ? values[0] : "["+values.join(",")+"]"
}

function propertyMap(properties) {
  const keys = Object.keys(properties).filter(key => propertyKeyPattern.test(key)).sort()
  if (keys.length) {
    const props = keys.map(key => escape(key)+":"+valueList(properties[key]))
    return ` {${props.join(", ")}}`
  } else {
    return ""
  }
}

function serializeNode({ id, labels, properties }) {
  labels = labels.filter(label => nodeLabelPattern.test(label)).map(l => `:${escape(l)}`).join("")
  return `CREATE (${escape(id)}${labels}${propertyMap(properties)})`
}

function serializeEdge({ from, to, labels, properties }) {
  // edge label is mandatory and non-repeatable
  const type = labels.find(label => edgeLabelPattern.test(label)) ?? defaultEdgeLabel
  return `CREATE (${escape(from)})-[:${escape(type)}${propertyMap(properties)}]->(${escape(to)})`
}

function serialize({ nodes, edges }) {
  return [...nodes.map(serializeNode), ...edges.filter(e => !e.undirected).map(serializeEdge)].map(s => s+"\n").join("")
}

export default {
  name: "Cypher CREATE statements",

  nodeLabels: "0..*",
  nodeLabelPattern,

  edgeLabels: "1",
  defaultEdgeLabel,
  edgeLabelPattern,

  propertyKeyPattern,

  direction: "directed",
  graphAttributes: false,
  subgraphs: false,

  parse: input => wrapPeggyParser(parse, input),
  serialize
}
