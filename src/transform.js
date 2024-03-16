import { isNumber } from "./utils.js"

export function addIdProperty(graph, idprop) {
  for (let {id,properties} of graph.nodes) {
    if (idprop in properties) {
      // identifier is always made first value
      properties[idprop] = properties[idprop].filter(v => v !== id)
      properties[idprop].unshift(id)
    } else {
      properties[idprop] = [id]
    }
  }
}

export function scaleSpatial(graph, scale) {
  for (let {properties} of graph.nodes) {
    for (let key of ["x","y","width","height","pos"]) {
      if (key in properties) {
        properties[key] = properties[key].map(value => {
          if (isNumber(value)) {
            return value * scale
          } else if (/^\d+(\.\d+)?,\d+(\.\d+)?$/.test(value)) {
            // https://graphviz.org/docs/attr-types/point/
            // https://graphviz.org/docs/attr-types/splineType/ (not supported!)
            return value.split(",").map(v => v * scale).join(",")
          }
          return value
        })
      }
    }
  }
}
