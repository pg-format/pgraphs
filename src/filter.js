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

export function filterLabels(pattern, { nodes, edges }, warn) {
  var labels = 0
  const f = e => { 
    labels += e.labels.length 
    e.labels = e.labels.filter(label => pattern.test(label))
    labels -= e.labels.length 
  }
  nodes.forEach(f)
  edges.forEach(f)
  warn?.message({ labels })
}

export const warn = {
  message(removed) {
    const msg = Object.entries(removed)
      .filter(e => e[1] > 0)
      .map(e => `${e[1]} ${e[0]}`)
    if (msg.length > 0) {
      console.error(`Removed ${msg.join(" and ")}.`)
    }
  },

  // Detect and warn in number of nodes and/or edges have been reduced
  graphReduced(before, after, subtype={}) {
    const removed = {}
    for (let type of ["nodes", "edges"]) {
      const diff = before?.[type]?.length - after?.[type]?.length
      if (diff > 0) {
        var name = subtype[type] ? subtype[type] + " " + type : type
        if (diff === 1) {name = name.replace(/s$/,"")}
        removed[name] = diff
      }
    }
    this.message(removed)
  }
}
