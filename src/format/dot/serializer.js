/**
 * Serialize PG graph in GraphViz DOT syntax.
 *
 * - Node labels are ignored
 * - Boolean and Null values are converted to strings
 * - Special characters \t \b \f \n \r are converted to space
 * - All edges are undirected if at least one edge is undirected
 */

const idPattern = /^([_a-zA-Z\200-\377][_a-zA-Z\200-\3770-9]*|-?(\.[0-9]+|[0-9]+(\.[0-9]*)?))$/

const serializeId = id => (idPattern.test(id)
  ? id
  : "\"" +  id.replaceAll(/[\t\b\f\n\r]/g, " ").replaceAll("\"", "\\\"") + "\"")

const serializeKeyValue = (key, value) => value.map(value => serializeId(key) + "=" + serializeId(value)).join(" ")

const serializeProperties = properties => {
  const keys = Object.keys(properties)
  return keys.length
    ? " [" + keys.sort().map(key => serializeKeyValue(key, properties[key])).join(" ") + "]"
    : ""
}

const serializeNode = ({ id, properties }) => "  " + serializeId(id) + serializeProperties(properties) + ";"

export default ({ nodes, edges }) => {
  const type = edges.some(e => e.undirected) ? "graph" : "digraph"
  const dir = type == "graph" ? " -- " : " -> "

  const serializeEdge = ({ from, to, properties }) => "  " + serializeId(from) + dir + serializeId(to) + serializeProperties(properties) + ";"

  return [
    `${type} {`,
    ...nodes.map(serializeNode),
    ...edges.map(serializeEdge),
    "}",
  ].join("\n") + "\n"
}
