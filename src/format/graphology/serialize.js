import { definedFields } from "../../utils.js"

function toAttributes(properties) {
  const attr = Object.keys(properties).sort().map(key =>
    properties[key].length > 1 ? [key, properties[key]] : [key, properties[key][0]])
  return attr.length ? Object.fromEntries(attr) : undefined
}

export function toGraphology({ nodes, edges }) {
  const undirected = !!edges[0]?.undirected
  const type = edges.some(e => !e.undirected == undirected)
    ? "mixed" : (undirected ? "undirected" : "directed")

  nodes = nodes.map(({id, properties}) => definedFields({
    key: id,
    attributes: toAttributes(properties)
  }))

  edges = edges.map(({id, from, to, properties, undirected}) => definedFields({
    key: id,
    source: from,
    target: to,
    attributes: toAttributes(properties),
    undirected
  }))

  return {
    options: { type, multi: true, allowSelfLoops: true },
    attributes: {},
    nodes,
    edges,
  }
}

export const serialize = graph => JSON.stringify(toGraphology(graph), null, 2) + "\n"
