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

export const parse = string => fromGraphology(JSON.parse(string))
