/**
 * Serialize PG graph in GraphML syntax.
 *
 * - Node labels and property labels are ignored.
 *
 * - Boolean and Null property values are converted to string
 * - Special characters \t \b \f \n \r are converted to space
 * - Graph type is digraph only of no edge is undirected
 */

import XMLWriter from "../../xmlwriter.js"

const empty = obj => !Object.keys(obj).length

// TODO: use optional attribute data.type? Content seems to be not specified
function writeProperties (properties, xml) {
  for (let key of Object.keys(properties).sort()) {
    for (let value of properties[key]) {
      xml.element("data", { key }, value)
    }
  }
}

export default ({ nodes, edges }) => {
  const defaultDirected = !edges.some(e => e.undirected)

  const xml = new XMLWriter("graphml", { xmlns: "http://graphml.graphdrawing.org/xmlns" })
  xml.start("graph", { edgedefault: defaultDirected ? "directed" : "undirected" })

  for (let { id, properties } of nodes) {
    if (empty(properties)) {
      xml.element("node", { id })
    } else {
      xml.start("node", { id })
      writeProperties(properties, xml)
      xml.end()
    }
  }

  for (let { id, from, to, properties, undirected } of edges) {
    const directed = defaultDirected != !undirected ? { directed: !undirected }  : {}
    if (empty(properties)) {
      const edge = { source: from, target: to, ...directed }
      if (id) { edge.id = id } 
      xml.element("edge", edge)
    } else {
      xml.start("edge", { source: from, target: to, ...directed })
      writeProperties(properties, xml)
      xml.end()
    }
  }

  return xml.toString()
}
