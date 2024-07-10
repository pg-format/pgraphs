import { idPatternFilter } from "../../filter.js"

const escapeString = s =>
  "\"" + s.replace(/["#]/g,c => "#"+c.charCodeAt(0)) + "\""

function serializeNode({id, properties}) {
  return properties?.name?.length
    ? `${id}[${escapeString(properties.name[0])}]` : id
}

function serializeEdge({from, to, properties, undirected}) {
  const head = undirected ? "---" : "-->"
  return properties?.name?.length
    ? `${from} -- ${escapeString(properties.name[0])} ${head} ${to}`
    : `${from} ${head} ${to}`
}

const idPattern = /^[\p{L}\p{N}_]+$/u

export default (graph, warn) => {
  const { nodes, edges } = idPatternFilter(idPattern,graph)
  warn?.graphReduced(graph, { nodes, edges }, {}, "invalid identifiers")

  const lines = [
    ...nodes.map(serializeNode),
    ...edges.map(serializeEdge)
  ]
  return "flowchart LR\n" + lines.map(line => "    " + line + "\n").join("")
}
