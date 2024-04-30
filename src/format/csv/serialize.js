// CSV files to be used withg neo4j-admin importer
// https://neo4j.com/docs/operations-manual/current/tutorial/neo4j-admin-import/
// https://docs.aws.amazon.com/neptune/latest/userguide/bulk-load-tutorial-format-opencypher.html

import { CSVWriter } from "../../utils.js"
import { MultiTarget } from "../../target.js"
import { FieldSchema } from "../../schema.js"

function addProperties(map, properties, arrayDelimiter) {
  // TODO: remove or escape arrayDelimiter (https://github.com/neo4j/neo4j/issues/13445)
  return Array.from(map).map(([key]) => (properties[key] || []).join(arrayDelimiter))
}

// TODO: if a colon appears within a property name, it must be escaped by preceding it with a backslash: \:.
const props2row = props => Array.from(props)
  .map(([key, { type, repeated }]) => `${key}:${type}${repeated ? "[]" : ""}`)

const serialize = ({ nodes, edges }, target, options = {}) => {
  // build schema
  const nodeProps = new FieldSchema({ namePattern: /^[^\s,]+$/ })
  const edgeProps = new FieldSchema({ namePattern: /^[^\s,]+$/ })
  nodes.forEach(node => nodeProps.extend(node.properties))
  edges.forEach(edge => edgeProps.extend(edge.properties))
  
  // Configure CSV dialect
  const arrayDelimiter = options?.arrayDelimiter || "\0"
  const separator = options?.delimiter || ","
  const csv = new CSVWriter({ newline:"\n", separator })
  const ext = separator === "\t" ? "tsv" : "csv"

  if (typeof target === "string") {
    target = new MultiTarget(target)
  }

  const nodeTarget = target.open(`.nodes.${ext}`)
  const edgeTarget = target.open(`.edges.${ext}`)
  const nodeHeader = target.open(".nodes.header")
  const edgeHeader = target.open(".edges.header")

  nodeHeader.write(csv.writeRow([":ID", ":LABEL", ...props2row(nodeProps)]))
  for (let { id, labels, properties } of nodes) {
    // TODO: warn 
    labels = labels.map(s => s.replaceAll(arrayDelimiter, "")).join(arrayDelimiter)
    const row = [id, labels]
    row.push(...addProperties(nodeProps, properties, arrayDelimiter))
    nodeTarget.write(csv.writeRow(row))
  }

  edgeHeader.write(csv.writeRow([":START_ID", ":END_ID", ":TYPE", ...props2row(edgeProps)]))
  for (let { from, to, labels, properties } of edges) {
    const row = [from, to, labels[0] ?? ""]
    row.push(...addProperties(edgeProps, properties, arrayDelimiter))
    edgeTarget.write(csv.writeRow(row))
  }
}

serialize.multi = true

export default serialize
