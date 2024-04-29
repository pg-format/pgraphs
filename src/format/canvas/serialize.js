import { randomId, isNumber } from "../../utils.js"

// Serialize Property Graph to JSON Canvas
export default ({nodes, edges}) => {
  nodes = nodes.map(({ id, properties }) => {
    var x = properties.x?.[0]
    var y = properties.y?.[0]

    if (!isNumber(x) || !isNumber(y)) {
      if (/^\d+(\.\d+)?,\d+(\.\d+)?$/.test(properties.pos?.[0])) {
        [x, y] = properties.pos[0].split(",")
      } else {
        throw new Error(`Missing one of numeric properties x, y or pos in node ${id}`)
      }
    }

    var width = properties.width?.[0]
    var height = properties.height?.[0]
    if (!isNumber(width) || !isNumber(height)) {
      throw new Error("Every node must have numeric properties x, y, width, and height!")
    }

    [x,y,width,height] = [x,y,width,height].map(v => Math.round(v))

    const text = "" + (properties.text?.[0] ?? id)
    const type = "text" // TODO: other node types

    // TODO: include color, if available
    return { id: ""+id, x, y, width, height, type, text }
  }).filter(Boolean)

  edges = edges.map(({ id, from, to }) => {
    return { id: id || randomId(), fromNode: ""+from, toNode: ""+to }
  })

  return JSON.stringify({ nodes, edges },null,1)
}
