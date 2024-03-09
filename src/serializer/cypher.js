const defaultEdgeLabel = "edge"
const nodeLabelPattern = /./    
const edgeLabelPattern = /./
const propertyKeyPattern = /./

const escape = id => /^(\p{ID_Start}|\p{Pc})(\p{ID_Continue}|\p{Sc})*$/u.test(id)
  ? id : "`" + id.replaceAll("`","``") + "`"

function valueList(values) {
  values = values.map(v => typeof v === "string" ? JSON.stringify(v) : v)
  return values.length == 1 ? values[0] : "["+values.join(",")+"]"
}

function propertyMap(properties) {
  const keys = Object.keys(properties).filter(key => propertyKeyPattern.test(key))
  if (keys.length) {
    const props = keys.map(key => escape(key)+":"+valueList(properties[key]))
    return ` {${props.join(", ")}}`
  } else {
    return ""
  }
}

function createNode({ id, labels, properties }) {
  labels = labels.filter(label => nodeLabelPattern.test(label)).map(l => `:${escape(l)}`).join("")
  return `CREATE (${escape(id)}${labels}${propertyMap(properties)})`
}

function createEdge({ from, to, labels, properties }) {
  // edge label is mandatory and non-repeatable
  const type = labels.find(label => edgeLabelPattern.test(label)) ?? defaultEdgeLabel
  return `CREATE (${escape(from)})-[:${escape(type)}${propertyMap(properties)}]->(${escape(to)})`
}

export default ({ nodes, edges }) => {
  return [...nodes.map(createNode), ...edges.filter(e => !e.undirectde).map(createEdge)].map(s => s+"\n").join("")
}
