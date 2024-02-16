// CSV files to be used withg neo4j-admin importer
// https://neo4j.com/docs/operations-manual/current/tutorial/neo4j-admin-import/

import { MultiTarget } from "../target.js"

// TODO: use another character
const arrayDelimiter = ";"

const str = s => {
  s = s.replaceAll(/[\n\r]+/g," ") // line breaks cannot be encoded
  return (s === "" || /"/.test(s)) ? `"${s.replaceAll("\"","\"\"")}"` : s
}

const tsv = row => row.join("\t") + "\n"

const datatype = value => {
  if (typeof value == "number") {
    return Number.isInteger(value) ? "int" : "float"
  } else if (typeof value === "boolean") {
    return "boolean"
  } else {
    return "string"
  }
}

function addProperties(map, properties, arrayDelimiter) {
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
          if ((type == "int" || valuetype == "int") &&
              (type == "float" || valuetype == "float")) {
            valuetype = "float"
            type = "float"
          } else {
            console.log("WARNING: Neo4j CSV cannot serialize mixed property types, using string instead!")
            valuetype = "string"
            type = "string"
          }
        }
      }

      if (!(key in map) || map[key].type != type || (array && !map[key].array)) {
        map[key] = { type, array }
      }
    }
  }

  // TODO: replace arrayDelimiter
  return Object.keys(map).map(key => str(props.get(key).join(arrayDelimiter)) ?? "")
}

// TODO: escape or restrict property key?
const props2row = props => Object.entries(props)
  .map(([key,{type,array}]) => `${key}:${type}${array?"[]":""}`)

const serialize = ({nodes, edges}, target) => {
  const nodeProps = new Map()
  const edgeProps = new Map()

  const node2row = ({ id, labels, properties }) => {
    // TODO: escape id and labels
    const row = [ id, labels.join(arrayDelimiter) ] 
    row.push(...addProperties(nodeProps, properties, arrayDelimiter))
    return row
  }

  const edge2row = ({ from, to, labels, properties }) => {
    // TODO: escaping of from, to, labels
    return [ from, to, labels[0] ?? "", ...addProperties(edgeProps, properties, arrayDelimiter) ]
  }

  if (typeof target === "string") {
    target = new MultiTarget(target)
  }

  const nodeTarget = target.open(".nodes.tsv")
  const edgeTarget = target.open(".edges.tsv")
  const nodeHeader = target.open(".nodes.header")
  const edgeHeader = target.open(".edges.header")

  nodes.forEach(node => nodeTarget.write(tsv(node2row(node))))
  edges.forEach(edge => edgeTarget.write(tsv(edge2row(edge))))

  nodeHeader.write(tsv([":ID",":LABEL",...props2row(nodeProps)]))
  edgeHeader.write(tsv([":START_ID",":END_ID",":TYPE",...props2row(edgeProps)]))
}

serialize.multi = true

export default serialize
