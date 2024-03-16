import { Writer } from "@pinemach/csv"
export const CSVWriter = Writer

// Maps arbitrary identifier strings to enumerated identifiers
export class IDMap extends Map {
  constructor(base = "") {
    super()
    this.base = base
  }

  map(id) {
    if (this.has(id)) {
      return this.get(id)
    } else {
      const mapped = `${this.base}${this.size + 1}`
      this.set(id, mapped)
      return mapped
    }
  }
}

// Construct graph object, given nodes as object
export const graph = (nodes, edges) => ({
  nodes: Object.keys(nodes).sort().map(id => nodes[id]),
  edges,
})

export const addProperties = (propList, properties={}) => {
  for (let [key, values] of propList) {
    if (values.length) {
      if (key in properties) {
        if (!(properties[key] instanceof Set)) {
          properties[key] = new Set(properties[key])
        }
        for (let v of values) {properties[key].add(v)}
      } else {
        properties[key] = new Set(values)
      }
    }
  }
  for (let key in properties) {
    if (properties[key] instanceof Set) {
      properties[key] = [...properties[key].values()]
    }
  }
  return properties
}

export const addIdProperty = (graph, idprop) => {
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

export function wrapPeggyParser(parse, input) {
  try {
    return parse(input) 
  } catch (e) {
    var msg = e.message
    if (e.location) {
      const { line, column } = e.location.start
      msg = msg.replace(/\.$/,"") + ` at line ${line}:${column}.`
    }
    throw new Error(msg)
  }
}

export const randomId = () => "_"+(Math.random() + 1).toString(36).substring(2)
