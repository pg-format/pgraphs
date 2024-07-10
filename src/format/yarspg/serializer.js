import { idPatternFilter, filterLabels } from "../../filter.js"

const serializeNode = ({id, labels, properties}) =>
  "(" + id + serializeLabels(labels) + serializeProperties(properties) + ")"

const serializeEdge = ({id, from, to, labels, properties, undirected}) =>
  `(${from})-(${id ?? ""}${serializeLabels(labels) + serializeProperties(properties) + (undirected ? ")--" : ")->")}(${to})`

const serializeLabels = labels => labels.length ? "{" + labels.join(",") + "}" : ""

const serializeProperties = properties => {
  const keys = Object.keys(properties)
  return keys.length
    ? "[" + keys.sort().map(key => `${serializeString(key)}:${serializeValue(properties[key])}`) + "]"
    : ""
}

const stringEscape = { "\n": "\\n", "\r": "\\r", "\"": "\\\"", "\\": "\\\\" }
const serializeString = s => "\"" + s.toString().replaceAll(/["\\\n\r]/g, c => stringEscape[c]) + "\""

const serializeValue = value => value.length == 1
  ? serializeString(value[0]) : "[" + value.map(serializeString).join(",") + "]"

const idPattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/u
const labelPattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/u

export default (graph, warn) => {
  const { nodes, edges } = idPatternFilter(idPattern,graph)
  warn?.graphReduced(graph, { nodes, edges }, {}, "invalid identifiers")
  filterLabels(labelPattern, { nodes, edges }, warn)

  const lines = [
    ...nodes.map(serializeNode),
    ...edges.map(serializeEdge)
  ]

  return lines.join("\n")+"\n"
}
