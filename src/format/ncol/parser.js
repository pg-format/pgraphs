import { ParsingError } from "../../error.js"
import { graph, isNumber } from "../../utils.js"

export default str => {
  var nodes = new Set()
  const edges = []
  str.split("\n").forEach((line, i) => {
    const parts = line.split(" ")
    if (parts.length < 2 || parts.length > 3) {
      throw new ParsingError(`Invalid line ${i+1}: '${line}'`)
    }
    const [from, to, weight] = parts
    const properties = {}
    if (parts.length == 3) {
      if (isNumber(weight)) {
        properties.weight = [1*weight]
      } else {
        throw new ParsingError(`Invalid weight in line ${i+1}: ${weight}`)
      }
    }
    edges.push({ from, to, labels: [], properties })
    nodes.add(from)
    nodes.add(to)
    // TODO: error on multi-edges or reverse edges?
  })
  nodes = [...nodes.values()].map(id => ({id, labels:[], properties: {}}))
  return graph(nodes, edges)
}

