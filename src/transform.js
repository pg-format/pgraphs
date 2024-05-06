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

import { xmlEscape } from "./xmlwriter.js"

function htmlElement(tag, text) {
  return `<${tag}>${xmlEscape(text)}</${tag}>`
}

function addHtmlSummaryProperty(element, prop) {
  var name = []
  if (element.id) {
    name.push(htmlElement("b",element.id)) 
  }
  name.push(...(element.labels||[]).map(l => htmlElement("u",l)))
  for (let [key,values] of Object.entries(element.properties || {})) {
    name.push(htmlElement("i",`${key}: ${values.join("|")}`))
  }

  if (name.length) {
    name = name.join("<br/>")
    if (prop in element.properties) {
      element.properties[prop].unshift(name)
    } else {
      element.properties[prop] = [name]
    }
  }
}

export function addHtmlSummary(graph, format) {
  for (let node of graph.nodes) {
    const name = typeof format.nodeName === "string" ? format.nodeName : "label"
    addHtmlSummaryProperty(node, name)
  }
  for (let edge of graph.edges) {
    const name = typeof format.edgeName === "string" ? format.edgeName : "label"
    addHtmlSummaryProperty(edge, name)
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
