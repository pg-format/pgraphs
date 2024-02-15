/**
 * Serialize PG graph in GraphML syntax.
 *
 * - Node labels and property labels are ignored.
 *
 * - Boolean and Null property values are converted to string
 * - Special characters \t \b \f \n \r are converted to space
 * - Graph type is digraph only of no edge is undirected
 */

const xmlEntity = {
  ">": "&gt;",
  "<": "&lt;",
  "'": "&apos;",
  "\"": "&quot;",
  "&": "&amp;",
}

const xmlEscape = s => `${s}`.replaceAll(/[&"<>']/g, c => xmlEntity[c])

// TODO: use optional attribute data.type? Content seems to be not specified
const serializeProperties = properties =>
  Object.keys(properties).sort().map(key =>
    properties[key].map(value =>
      `      <data key="${xmlEscape(key)}">${xmlEscape(value)}</data>`).join("\n"),
  ).join("\n")
 
const serializeNode = ({ id, properties }) => {
  const data = serializeProperties(properties)
  return `    <node id="${xmlEscape(id)}"` + (data ? `>\n${data}\n    </node>` : "/>")
}

const serializeEdge = ({ from, to, properties }) => {
  const data = serializeProperties(properties)
  return `    <edge source="${xmlEscape(from)}" target="${xmlEscape(to)}"` +
    (data ? `>\n${data}\n    </edge>` : "/>")
}

export default ({ nodes, edges }) => {
  const type = edges.some(e => e.undirected) ? "undirected" : "directed"

  const xml = [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<graphml xmlns=\"http://graphml.graphdrawing.org/xmlns\">",
    `  <graph edgedefault="${type}">`,
  ]

  xml.push(...nodes.map(serializeNode))
  xml.push(...edges.map(serializeEdge))
  xml.push("  </graph>")
  xml.push("</graphml>")

  return xml.join("\n")
}
