// YARS-PG 5.0.0 without graph schema

import { IDMap } from "../utils.js"

const stringEscape = {
  "\t": "\\t",
  "\b": "\\b",
  "\n": "\\n",
  "\r": "\\r",
  "\f": "\\f",
  "\"": "\\\"",
  ";": "\\;",
  "\\": "\\\\", 
}
const stringEscapeChars = /[\t\b\n\r\f";\\]/g
const string = s => `"${s.toString().replaceAll(stringEscapeChars, c => stringEscape[c])}"`

const serializeKeyValue = (key, value) =>
  string(key) + ":" +
  (value.length == 1 ? string(value[0]) : "[" + value.map(string).join(",") + "]")
    
const serializeProperties = properties => {
  const keys = Object.keys(properties)
  return keys.length ? "[" +
         keys.sort().map(key => serializeKeyValue(key, properties[key])) + "]" : ""
}

export default ({nodes, edges}) => {
  const ids = new IDMap("node")

  const serializeNode = ({id, labels, properties}) => 
    "(" + ids.map(id) +
    (labels.length ? `{${labels.map(string).join(",")}}` : "") +
    serializeProperties(properties) + ")"

  const serializeEdge = ({from, to, directed, labels, properties}) => 
    "(" + ids.map(from) + ")-" +
    (labels.length ? `[${string(labels[0])}]` : "") +
    serializeProperties(properties) +
    (directed ? "->" : "-") +
    "(" + ids.map(to) + ")"

  return [
    ...nodes.map(serializeNode),
    ...edges.map(serializeEdge),
  ].join("\n")+"\n"
}
