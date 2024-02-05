// Simple implementation without grammar and support of edge cases

// remove double quotes
const rmdq = s => s.replace(/^"(.+)"$/, "$1")

const extractItems = function (line) {
  let regexNode = /^("[^"]+"|[^"\s]+)/
  let regexEdge = /^("[^"]+"|[^"\s]+)\s+(->|--)\s+("[^"]+"|[^"\s]+)/
  let id1, id2, undirected
  let result
  
  if (!(result = regexEdge.exec(line))) {
    if (!(result = regexNode.exec(line))) {
      console.log("ERROR - this line is neither node nor edge: " + line)
      return
    } else {
      id1 = rmdq(result[1])
      id2 = null
      undirected = null
    }
  } else {
    id1 = rmdq(result[1])
    id2 = rmdq(result[3])
    undirected = (result[2] == "->") ? false : true
  }

  // LABELS
  let labels = new Set()
  let regexLabels = /\s:("[^"]+"|[^:"\s]+)/g
  while ((result = regexLabels.exec(line))) {
    labels.add(rmdq(result[1]))
  }
  // PROPERTIES
  let properties = new Map()
  let regexProperties = /\s("[^"]+"|[^"\s:]+):("[^"]*"|[^"\s]*)/g
  while ((result = regexProperties.exec(line))) {
    let key = rmdq(result[1])
    let value = result[2]
    if (!(properties.has(key))) {
      let values = new Set()
      values.add(value)
      properties.set(key, values)
    } else {
      let values = properties.get(key).add(value)
      properties.set(key, values)
    } 
  }

  return [id1, id2, undirected, Array.from(labels), properties]
}

export const parse = (pgstring) => {
  const nodes = {}, edges = []

  const lines = pgstring.split("\n")

  lines.forEach(line => { 
    if (!line.match(/^\s*(#.*)?$/)) { // comments and blank lines
      const item = extractItems(line)
      if (!item) {
        return
      }

      let [id, id2, undirected, labels, props] = item

      const properties = {}
      for (let [key, values] of props) {
        properties[key] = Array.from(values).map(rmdq)
      }

      if (id2 == null) {
        nodes[id] = { id, labels, properties }
      } else {
        const edge = { from: id, to: id2, labels, properties } 
        if (undirected) {
          edge.undirected = true
        }
        edges.push(edge)
        if (!(id in nodes)) {
          nodes[id] = { id, labels: [], properties: {} }
        }
        if (!(id2 in nodes)) {
          nodes[id2] = { id: id2, labels: [], properties: {} }
        }
      }
    }
  })

  return {
    nodes: Object.keys(nodes).sort().map(id => nodes[id]),
    edges,
  }
}

