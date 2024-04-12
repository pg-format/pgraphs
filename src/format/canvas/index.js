import { randomId, isNumber } from "../../utils.js"

const mapPropertyValues = props => 
  Object.fromEntries(Object.keys(props).map(key => [key, [props[key]]]))

// Parse JSON Canvas to Property Graph
const parse = input => {
  var { nodes, edges } = JSON.parse(input)
  return {
    nodes: (nodes||[]).map(({ id, type, ...props }) => ({
      id,
      labels: [type],
      properties: mapPropertyValues(props)
    })),
    edges: (edges||[]).map(({id, fromNode, toNode, ...props}) => ({
      id,
      from: fromNode,
      to: toNode,
      labels: [],
      properties: mapPropertyValues(props)
    }))
  }
}

// Serialize Property Graph to JSON Canvas
const serialize = ({nodes, edges}) => {
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

  edges = edges.map(({ from, to }) => {
    return { id: randomId(), fromNode: ""+from, toNode: ""+to }
  })

  return JSON.stringify({ nodes, edges },null,1)
}

export default {
  name: "JSON Canvas (experimental)",

  direction: "directed",

  nodeTypes: false,
  edgeTypes: false,

  nodeName: "text",
  edgeName: "label",
  edgeIdentifier: true,

  graphAttributes: false,
  nodeAttributes: false,
  edgeAttributes: false,
  visualAttributes: true,

  hierarchy: true,
  hyperEdges: false,
  multiEdges: true, // ?

  datatypes: false,

  url: "https://jsoncanvas.org/",
  serialize,
  parse,
}

