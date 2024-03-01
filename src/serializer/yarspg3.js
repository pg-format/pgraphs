// YARS-PG 3.0.0 with optional labels

const stringEscape = { "\\": "\\\\", "\"": "\\\"" }
const serializeString = s => "\"" + s.replaceAll(/[\n\r]/g, " ").replaceAll(/["\\]/g, c => stringEscape[c]) + "\""

const serializeValue = value => (typeof value === "string" ? serializeString(value) : value) 

const serializeKeyValue = (key, value) => serializeString(key) + ":"
  + (value.length == 1 ? serializeValue(value[0]) : "[" + value.map(serializeValue).join(",") + "]")

const serializeProperties = properties => {
  const keys = Object.keys(properties)
  return keys.length
    ? "["
         + keys.sort().map(key => serializeKeyValue(key, properties[key])) + "]"
    : ""
}

const serializeNode = ({ id, labels, properties }) => "<" + serializeString(id) + ">"
  + (labels.length ? `{${labels.map(serializeString).join(",")}}` : "")
  + serializeProperties(properties)

const serializeEdge = ({ from, to, directed, labels, properties }) => "(" + serializeString(from) + ")-"
    + (labels.length ? `[${serializeString(labels[0])}]` : "")
    + serializeProperties(properties)
    + (directed ? "->" : "-")
    + "(" + serializeString(to) + ")"

export default ({ nodes, edges }) => [
  ...nodes.map(serializeNode),
  ...edges.map(serializeEdge),
].join("\n") + "\n"
