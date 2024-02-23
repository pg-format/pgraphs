import { ParsingError } from "../error.js"
import { graph } from "../utils.js"

const node = /^([^#\s]+)(\s+(.*))?$/
const edge = /^([^#\s]+)\s+([^#\s]+)(\s(.*))?$/
const divider = /^\s*#\s*$/

export default (str) => {
  const nodes = {}, edges = []
  const properties = {}

  var match, expectEdge = false
  str.split("\n").filter(line => line !== "").forEach((line, lineNum) => {
    if (expectEdge) {
      if ((match = edge.exec(line))) {
        const from = match[1], to = match[2]

        // allow referencing undefined nodes in edges
        if (!(from in nodes)) {
          nodes[from] = { id: from, labels: [], properties }
        }
        if (!(to in nodes)) {
          nodes[to] = { id: to, labels: [], properties }
        }

        const labels = match[4] ? [match[4]] : []
        edges.push({ from, to, labels, properties })
      } else {
        throw new ParsingError("Expected TGF edge on LINE", lineNum)
      }
    } else {
      if (divider.test(line)) {
        expectEdge = true
      } else if ((match = node.exec(line))) {
        const id = match[1]
        const labels = match[3] ? [match[3]] : []
        nodes[id] = { id, labels, properties }
      } else {
        throw new ParsingError("Expected TGF node on LINE", lineNum)
      }
    }
  })

  return graph(nodes, edges)
}
