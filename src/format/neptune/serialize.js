import { CSVWriter } from "../../utils.js"
import { MultiTarget } from "../../target.js"
import { FieldSchema } from "../../schema.js"

// TODO: what about '\;' in values?
const multi = list => list.map(v => `${v}`.replaceAll(";", "\\;")).join(";")

function addProperties(map, properties) {
  // TODO: escape ;
  return Array.from(map).map(([key]) => multi(properties[key] || []))
}

const typeNames = {
  float: "Double",
  int: "Int",
  boolean: "Bool",
  string: "String"
}

const props2row = props => Array.from(props)
  .map(([key, { type, repeated }]) => `${key}:${typeNames[type]}${repeated ? "[]" : ""}`)

const serialize = ({ nodes, edges }, target) => {
  // build schema
  const nodeProps = new FieldSchema({ namePattern: /^[^\s,]+$/ }) // TODO: which allowed?
  const edgeProps = new FieldSchema({ namePattern: /^[^\s,]+$/ })
  nodes.forEach(node => nodeProps.extend(node.properties))
  edges.forEach(edge => edgeProps.extend(edge.properties))

  // Configure CSV dialect
  const csv = new CSVWriter({ newline:"\n" })

  if (typeof target === "string") {
    target = new MultiTarget(target)
  }

  const nodeTarget = target.open(".nodes.csv")
  const edgeTarget = target.open(".edges.csv")

  nodeTarget.write(csv.writeRow(["~id", "~label", ...props2row(nodeProps)]))
  for (const { id, labels, properties } of nodes) {
    let row = [id, multi(labels), ...addProperties(nodeProps, properties)]
    nodeTarget.write(csv.writeRow(row))
  }

  edgeTarget.write(csv.writeRow(["~id", "~from", "~to", "~label", ...props2row(edgeProps)]))
  let i=0
  for (const { from, to, labels, properties } of edges) {
    let row = [from, to, labels[0] ?? "", ...addProperties(edgeProps, properties)]
    edgeTarget.write(csv.writeRow([i++, ...row]))
  }
}

serialize.multi = true

export default serialize
