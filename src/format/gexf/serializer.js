import { XMLBuilder } from "fast-xml-parser"

export default (pg, warn) => {
  const removed = { labels: 0, edges: 0 }
  const edgeHash = new Set()

  const builder = new XMLBuilder({
    format: true,
    processEntities: false,
    ignoreAttributes: false,
    attributeNamePrefix: "@",
    suppressEmptyNode: true,
  })

  // TODO: collect properties as attributes (including VIZ attributes)

  const nodes = []
  const edges = []
  for (let { id, labels } of pg.nodes) {
    // TODO: map properties to attributes
    // TODO: optional label (=name)
    removed.labels += labels.length
    nodes.push({ "@id": id })
  }

  for (let { id, from, to, labels, undirected } of pg.edges) {
    const edge = { "@source": from, "@target": to}
    if (labels.length) {
      edge["@kind"] = labels[1]
      removed.labels += labels.length-1
    }

    // The triplet source-target-kind must be unique.
    const hash = JSON.stringify(edge)
    if (edgeHash.has(hash)) {
      removed.edges++
      continue
    }      
    edgeHash.add(hash)

    if (id) {edge.id = id}    // The identifier of an edge is defined by the XML-Attribute id and is optional.
    if (undirected) { edge["@type"] = "undirected" }
    
    // TODO: optional weight (double) and label (=name: string)
    // TODO: map properties to attributes

    edges.push(edge)
  }

  warn?.message(removed)

  const xml = {
    gexf: { 
      "@xmlns": "http://gexf.net/1.3", "@version": "1.3",
      graph: {
        "@defaultedgetype": "directed",
        nodes: { node: nodes },  
        edges: { edge: edges }
      }
    }
  }

  return builder.build(xml)
}
