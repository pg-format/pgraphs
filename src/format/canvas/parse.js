const mapPropertyValues = props => 
  Object.fromEntries(Object.keys(props).map(key => [key, [props[key]]]))

// Parse JSON Canvas to Property Graph
export default input => {
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


