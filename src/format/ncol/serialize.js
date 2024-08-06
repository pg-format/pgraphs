import { idPatternFilter, noLoopsFilter } from "../../filter.js"

// TODO also emit color file

export default ({ edges }, { warn } = {}) => {
  // TODO: nodes without edges are ignored
  const graph = noLoopsFilter(idPatternFilter(/^[^\s]+$/, { edges }))
  // TODO: warn explicitly for noLoopsFilter
  warn?.graphReduced({ edges }, graph, {}, "invalid identifers")

  // If there is edge A--B, there cannot also be edge B--A nor another edge A--B
  const weights = {}
  for (let {from, to, properties} of graph.edges) {
    const key = from <= to ? `${from} ${to}` : `${to} ${from}`
    const value = typeof (properties?.weight?.[0]) == "number" ? properties.weight[0] : null
    weights[key] = value
  }
  return Object.entries(weights)
    .map(([edge,weight]) => weight !== null ? `${edge} ${weight}` : edge).join("")
}
