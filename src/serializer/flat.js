// Oracle Flat File Format
// https://docs.oracle.com/en/database/oracle/property-graph/21.1/spgdg/using-property-graphs-oracle-database.html#GUID-7FC09376-F237-41E8-B0FE-9D1044A59FBB

import { MultiTarget } from "../target.js"

const escapeChar = {
  "%": "%25",
  "\t": "%09",
  " ": "%20",
  "\n": "%0A",
  "\r": "%0D",
  ",": "%2C;",
}

const serializeString = s => `${s}`.replaceAll(/[%\t \r\n,]/g, c => escapeChar[c])

const csv = row => row.map(serializeString).join(",") + "\n"

const datatype = value => {
  if (typeof value === "boolean") {
    return 6
  } // TODO: how is true/false serialized?
  if (typeof value === "number") {
    return Number.isInteger(value) ? 2 : 4
  } // TODO: how about Inf ?
  return 1 // string or cast to string
}

const serializeNode = ({ id, labels, properties }) => {

  // Property key " " is not allowed, this is a placeholder for no property
  if (!Object.keys(properties).length) {
    properties = { " ": [""] }
  }

  // only the first label is used
  const label = labels[0] ?? ""

  // FIXME: NODE ID MUST BE INTEGER!
  // TODO: multivalues are not allowed?
  // vertex_ID, key_name, value_type, value-if-not-numeric, value-if-numeric, value-of-date, vertex_label
  const rows = Object.keys(properties).sort().map(key => {
    const value = properties[key][0]
    const type = datatype(value)
    const row = [ id, key, type, 
      ...(typeof value == "number" ? ["",value,""] : [value,"",""]),
      label,
    ]
    return csv(row)
  }).join("")
  return rows
}

// TODO
const serializeEdge = () => "" // ({from, to, properties}) => ""

const serialize = ({ nodes, edges }, target) => {
  if (typeof target === "string") {
    target = new MultiTarget(target)
  }
  const opv = target.open(".opv")
  const ope = target.open(".ope")
  nodes.forEach(node => opv.write(serializeNode(node)))
  edges.forEach(edge => ope.write(serializeEdge(edge)))
}

// serializes to multiple files or streams
serialize.multi = true

export default serialize
