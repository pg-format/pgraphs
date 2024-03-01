// CSV files to be used withg neo4j-admin importer
// https://neo4j.com/docs/operations-manual/current/tutorial/neo4j-admin-import/
// https://docs.aws.amazon.com/neptune/latest/userguide/bulk-load-tutorial-format-opencypher.html

import { CSVWriter } from "../utils.js"
import { MultiTarget } from "../target.js"

const datatype = value => {
  if (typeof value === "number") {
    return Number.isInteger(value) ? "int" : "float"
  } else if (typeof value === "boolean") {
    return "boolean"
  } else {
    return "string"
  }
}

// TODO: Space, comma/delimiter, carriage return and newline characters are not allowed in the column headers, so property names cannot include these characters

function addProperties(map, properties, arrayDelimiter) {
  const props = new Map(Object.entries(properties))

  for (let [key, values] of props.entries()) {
    values = values.filter(v => v !== null)   // Ignore null values

    if (values.length) {
      const array = values.length > 1
      let { type } = map[key] || {}

      for (const value of values) {
        let valuetype = datatype(value)

        if (type == null) {
          type = valuetype
        } else if (type !== valuetype) {
          if ((type == "int" || valuetype == "int")
              && (type == "float" || valuetype == "float")) {
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

  // TODO: escape arrayDelimiter
  return Object.keys(map).map(key => (props.get(key) || []).join(arrayDelimiter))
}

// TODO: escape or restrict property key?
const props2row = props => Object.entries(props)
  .map(([key, { type, array }]) => `${key}:${type}${array ? "[]" : ""}`)

const serialize = ({ nodes, edges }, target, options = {}) => {
  // Configure CSV dialect
  const arrayDelimiter = options?.arrayDelimiter || ";" // TODO: customize, e.g. "\t" or "\x1F"
  const separator = options?.delimiter || ","
  const csv = new CSVWriter({ newline:"\n", separator })
  const ext = separator === "\t" ? "tsv" : "csv"

  const nodeProps = new Map()
  const edgeProps = new Map()

  const node2row = ({ id, labels, properties }) => {
    // TODO: escape id and labels
    labels = labels.map(l => l.replaceAll(arrayDelimiter, "\\" + arrayDelimiter)).join(arrayDelimiter) 
    const row = [id, labels]
    row.push(...addProperties(nodeProps, properties, arrayDelimiter))
    return row
  }

  const edge2row = ({ from, to, labels, properties }) =>
    // TODO: escape: from, to, labels?
    [from, to, labels[0] ?? "", ...addProperties(edgeProps, properties, arrayDelimiter)]

  if (typeof target === "string") {
    target = new MultiTarget(target)
  }

  const nodeTarget = target.open(`.nodes.${ext}`)
  const edgeTarget = target.open(`.edges.${ext}`)
  const nodeHeader = target.open(".nodes.header")
  const edgeHeader = target.open(".edges.header")

  nodes.forEach(node => nodeTarget.write(csv.writeRow(node2row(node))))
  edges.forEach(edge => edgeTarget.write(csv.writeRow(edge2row(edge))))
  nodeHeader.write(csv.writeRow([":ID", ":LABEL", ...props2row(nodeProps)]))
  edgeHeader.write(csv.writeRow([":START_ID", ":END_ID", ":TYPE", ...props2row(edgeProps)]))
}

serialize.multi = true

export default serialize
