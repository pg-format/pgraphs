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

function addHtmlSummaryProperty(element) {
  var name = []
  // TODO: HTML-Escape strings
  if (element.id) { name.push(`<b>${element.id}</b>`) }
  name.push(...(element.labels||[]).map(l => `<i>${l}</i>`))
  for (let [key,values] of Object.entries(element.properties || {})) {
    // TODO:escape values
    name.push(`<tt>${key}:${values.join("|")}</tt>`)
  }

  name = name.join("<br>")
  if (name !== "") {
    if ("name" in element.properties) {
      element.properties.name.unshift(name)
    } else {
      element.properties.name = [name]
    }
  }
}

export function addHtmlSummary(graph) {
  for (let node of graph.nodes) {
    addHtmlSummaryProperty(node)
  }
  for (let edge of graph.edges) {
    addHtmlSummaryProperty(edge)
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
