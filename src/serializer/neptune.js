// https://docs.aws.amazon.com/neptune/latest/userguide/load-data.html

// TODO: remove code duplication with csv format?

import { CSVWriter } from "../utils.js"
import { MultiTarget } from "../target.js"

const datatype = value => {
  if (typeof value == "number") {
    return Number.isInteger(value) ? "Int" : "Double"
  } else if (typeof value === "boolean") {
    return "Bool"
  } else {
    return "String"
  }
}

// TODO: what about '\;' in values?
const multi = list => list.map(v => `${v}`.replaceAll(";","\\;")).join(";")

function addProperties(map, properties) {
  const props = new Map(Object.entries(properties))

  for (let [key, values] of props.entries()) {
    values = values.filter(v => v !== null)   // ignore null values

    if (values.length) {
      const array = values.length > 1
      var { type } = map[key] || {}
      for (let value of values) {
        var valuetype = datatype(value)

        if (type == null) {
          type = valuetype
        } else if (type !== valuetype) {
          if ((type == "Int" || valuetype == "Int") &&
              (type == "Double" || valuetype == "Double")) {
            valuetype = "Double"
            type = "Double"
          } else {
            console.log("WARNING: Neptune CSV cannot serialize mixed property types, using String instead!")
            valuetype = "String"
            type = "String"
          }
        }
      }

      if (!(key in map) || map[key].type != type || (array && !map[key].array)) {
        map[key] = { type, array }
      }
    }
  }

  // TODO: escape ;
  return Object.keys(map).map(key => multi(props.get(key)||[]))
}


// TODO: escape or restrict property key?
const props2row = props => Object.entries(props)
  .map(([key,{type,array}]) => `${key}:${type}${array?"[]":""}`)

const serialize = ({nodes, edges}, target) => {
  const csv = new CSVWriter({newline:"\n"})

  if (typeof target === "string") {
    target = new MultiTarget(target)
  }

  const nodeRows = [], nodeProps = new Map()
  const edgeRows = [], edgeProps = new Map()
 
  for (let { id, labels, properties } of nodes) {
    nodeRows.push([ id, multi(labels), ...addProperties(nodeProps, properties) ])
  }

  for (let { from, to, labels, properties } of edges) {
    edgeRows.push([ from, to, labels[0] ?? "", ...addProperties(edgeProps, properties) ])
  }

  const nodeTarget = target.open(".nodes.csv")
  nodeTarget.write(csv.writeRow(["~id","~label",...props2row(nodeProps)]))
  nodeRows.forEach(row => nodeTarget.write(csv.writeRow(row)))

  const edgeTarget = target.open(".edges.csv")
  edgeTarget.write(csv.writeRow(["~id","~from","~to","~label",...props2row(edgeProps)]))
  edgeRows.forEach((row, i) => edgeTarget.write(csv.writeRow([i, ...row])))
}

serialize.multi = true

export default serialize
