import { parse as parseLine } from "./pg_line_parser.js"

//const unquote = s => s[0] === '"' ? JSON.parse(s) ? : s

export const parse = (pgstring) => {
  const nodes = {}, edges = []

  const lines = pgstring.split("\n")

  lines.forEach(line => { 
    if (!line.match(/^\s*(#.*)?$/)) { // comments and blank lines
      const { edge, node } = parseLine(line)
      if (node) {
 //       const { id, labels, properties } = node
 //       const id = unquote(node.id)
        nodes[node.id] = node
      } else if (edge) {
        const { from, to, labels, properties, direction } = edge
        const e = { from, to, labels, properties }

        if (!(from in nodes)) {
          nodes[from] = { id: from, labels: [], properties: {} }
        }
        if (!(to in nodes)) {
          nodes[to] = { id: to, labels: [], properties: {} }
        }

        if (direction === "--") {
          e.undirected = true
        }
        edges.push(e)
      }
    }
  })

  return {
    nodes: Object.keys(nodes).sort().map(id => nodes[id]),
    edges,
  }
}
