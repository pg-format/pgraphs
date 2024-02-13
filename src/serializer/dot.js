/**
 * Serialize PG graph in GraphViz DOT syntax.
 *
 * - Node labels and repetitions of property keys are ignored
 * - Boolean and Null property values are converted to string
 * - Special characters \t \b \f \n \r are converted to space
 * - Graph type is digraph only of no edge is undirected
 */

const idPattern = /^([_a-zA-Z\200-\377][_a-zA-Z\200-\3770-9]*|-?(\.[0-9]+|[0-9]+(\.[0-9]*)?))$/

// TODO: how about Unicode?
const serializeId = id => {
  if (idPattern.test(id)) {
    return id
  }
  id = id.replaceAll(/[\t\b\f\n\r]/g," ").replaceAll("\"", "\\\"")
  return `"${id}"`
}

const serializeKeyValue = (key, value) =>
  serializeId(key) + "=" + serializeId(value)

const serializeProperties = properties => {
  const keys = Object.keys(properties)
  if (keys.length) {
  // repeated values are ignored
    const pairs = keys.sort().map(key => serializeKeyValue(key, properties[key][0]))
    return " [" + pairs.join(" ") + "]"
  } else {
    return ""
  }
}

const serializeNode = ({id, properties}) =>
  "  " + serializeId(id) + serializeProperties(properties) + ";"

const serializeEdge = ({from, to, undirected, properties}) => {
  const dir = undirected ? " -- " : " -> "
  return "  " + serializeId(from) + dir + serializeId(to) + serializeProperties(properties) + ";"
}

export default ({nodes, edges}) => {
  const type = edges.some(e => e.undirected) ? "graph" : "digraph"
  return [
    `${type} {`,
    ...nodes.map(serializeNode),
    ...edges.map(serializeEdge),
    "}",
  ].join("\n")+"\n"
}
