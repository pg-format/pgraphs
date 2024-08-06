import features from "./features.js"

// TODO: move to features
const defaultEdgeType = "edge"
const { propertyKeyPattern } = features

export const escape = id => /^(\p{ID_Start}|\p{Pc})(\p{ID_Continue}|\p{Sc})*$/u.test(id)
  ? id : "`" + id.replaceAll("`","``") + "`"

// TODO: Cypher differentiates between single value 1 and list of one value [1]
// and it also supports empty collection []!

export function serializeValue(value) {
  return typeof value === "string" ? JSON.stringify(value) : value
}

function valueList(key, values) {
  if (values.length) {
    const type = typeof values[0] // use type of first value as reference
    values = values.filter(v => typeof v === type) // TODO: warn
    values = values.map(serializeValue)
    values = values.length == 1 ? values[0] : "["+values.join(",")+"]"
    if (values !== "") {
      return `${escape(key)}:${values}`
    }
  }
}

export function serializeProperties(properties) {
  const keys = Object.keys(properties).filter(key => propertyKeyPattern.test(key)).sort()
  const props = keys.map(key => valueList(key, properties[key])).filter(v => v !== undefined)
  if (props.length) {
    return ` {${props.join(", ")}}`
  } else {
    return ""
  }
}

export function serializeNode({ id, labels, properties }, merge) {
  labels = labels.map(l => `:${escape(l)}`).join("")
  id = id ? escape(id) : ""
  const stm = merge ? "MERGE (" : "CREATE ("
  return stm + `${id}${labels}${serializeProperties(properties)})`.replace(/^ /,"")
}

export function serializeEdge({ from, to, labels, properties }, merge) {
  const type = labels[0] ?? defaultEdgeType
  const stm = merge ? "MERGE " : "CREATE "
  return `${stm}(${escape(from)})-[:${escape(type)}${serializeProperties(properties)}]->(${escape(to)})`
}

export function serialize({ nodes, edges }, { warn, merge } = {}) {
  const directedEdges = edges.filter(e => !e.undirected)
  warn?.graphReduced({ edges }, { edges: directedEdges }, { edges: "undirected" })
  
  const removedEdgeLabels = directedEdges.reduce((n,{labels}) => n+labels.length-1,0)
  warn?.message({"edge labels": removedEdgeLabels}, "edges have one label each")

  const serNode = n => serializeNode(n, merge)
  const serEdge = e => serializeEdge(e, merge)
  return [...nodes.map(serNode), ...directedEdges.map(serEdge)].map(s => s+"\n").join("")
}


