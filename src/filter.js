// Select by node identifier matching a pattern
export function idPatternFilter(pattern, {nodes, edges}) {
  return {
    nodes: (nodes||[]).filter(n => pattern.test(n.id)),
    edges: (edges||[]).filter(e => pattern.test(e.from) && pattern.test(e.to))
  }
}

// Filter out loops (edges from node to itself)
export function noLoopsFilter({nodes, edges}) {
  return {
    nodes,
    edges: (edges||[]).filter(e => e.from !== e.to)
  }
}
