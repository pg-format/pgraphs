import { isValue, definedFields } from "../../utils.js"

// Graphology => PG

function fromAttributes(attributes) {
  var entries = Object.entries(attributes || {}).map(([key,value]) => {
    value = Array.isArray(value) ? value : [value]
    return [key,value.filter(isValue)]
  })
  entries = entries.filter(([key,values]) => key !== "" && values.length>0)
  return Object.fromEntries(entries)
}

export function fromGraphology(graph) {
  if (typeof graph.export === "function") {
    graph = graph.export()
  }
  const nodes = graph.nodes.filter(n => n.key !== "")
    .map(({key, attributes}) => ({
      id: key,
      labels: [],
      properties: fromAttributes(attributes)
    }))
  const edges = graph.edges.filter(e => e.source !== "" && e.target !== "")
    .map(({key, source, target, attributes, undirected}) => definedFields({
      id: key,
      from: source,
      to: target, 
      labels: [],
      properties: fromAttributes(attributes),
      undirected
    }))
  return { nodes, edges }
}

// PG => Graphology

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

export default {
  name: "Graphology import/export", 
  parse: string => fromGraphology(JSON.parse(string)),
  serialize: graph => JSON.stringify(toGraphology(graph), null, 2)+"\n",
  direction: "mixed",
  nodeTypes: false,
  edgeTypes: false,
  edgeIdentifier: true,
  nodeName: false,
  edgeName: false,
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
