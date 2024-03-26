import { isValue } from "../../utils.js"

// remove undefined fields
function clean(obj) {
  Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
  return obj
}

export function fromAttributes(attributes) {
  var entries = Object.entries(attributes || {}).map(([key,value]) => {
    value = Array.isArray(value) ? value : [value]
    return [key,value.filter(isValue)]
  })
  entries = entries.filter(([key,values]) => key !== "" && values.length>0)
  return Object.fromEntries(entries)
}

function toAttributes(properties) {
  const attr = Object.keys(properties).sort().map(key =>
    properties[key].length > 1 ? [key, properties[key]] : [key, properties[key][0]])
  return attr.length ? Object.fromEntries(attr) : undefined
}

export function fromGraphology(graph) {
  if (typeof graph.export === "function") {
    graph = graph.export()
  }
  // TODO: filter out empty string node identifiers
  return { 
    nodes: graph.nodes.map(({key, attributes}) => ({
      id: key, labels: [], properties: fromAttributes(attributes)
    })),
    edges: graph.edges.map(({source, target, attributes, undirected}) => clean({
      from: source,
      to: target, 
      labels: [],
      properties: fromAttributes(attributes),
      undirected
    }))
  }
}

export function toGraphology({ nodes, edges }) {
  const undirected = !!edges[0]?.undirected
  const type = edges.some(e => !e.undirected == undirected)
    ? "mixed" : (undirected ? "undirected" : "directed")

  nodes = nodes.map(({id, properties}) => clean({
    key: id,
    attributes: toAttributes(properties)
  }))
  edges = edges.map(({from, to, properties, undirected}, i) => clean({
    key: `${i+1}`,
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

export default {
  name: "Graphology import/export", 
  parse: string => fromGraphology(JSON.parse(string)),
  serialize: graph => JSON.stringify(toGraphology(graph), null, 2),

  direction: "mixed",
  nodeTypes: false,
  edgeTypes: false,
  nodeNames: false,
  edgeNames: false,
  graphAttributes: true,
  nodeAttributes: true,
  edgeAttributes: true,
  visualAttributes: false,
  hierarchy: false,
  hyperEdges: false,
  multiEdges: true,

  datatypes: "JSON",
  url: "https://graphology.github.io/serialization.html",
}
