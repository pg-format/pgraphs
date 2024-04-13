import { isValue } from "../../utils.js"

const plainId = /^[^\s<>"{}|^`\\#:(-][^\s<>"{}|^`\\]*$/

export const quoteId = s => plainId.test(s) && !/--/.test(s) ? s : JSON.stringify(s)

export const quoteKey = s => plainId.test(s) && !/--/.test(s) ? s : JSON.stringify(s)

const valuePattern = /[\s<>"{}|^`\\#:(,-]|^(-?[0-9]+(\.[0-9]+)?|true|false)$/

const quoteValue = s => ((typeof s === "string" && s !== "" && !valuePattern.test(s)) ? s : JSON.stringify(s))

export const serializeLabels = labels => labels.map(label => ":" + quoteId(label)).join(" ")

const serializeKeyValue = (key, value) => 
  quoteKey(key) + ":" + (key.match(/:/) ? " " : "") + quoteValue(value)

export const serializeProperties = properties => Object.entries(properties)
  .filter(e => e[0] !== "" && Array.isArray(e[1])) 
  .map(([key, values]) =>
    values.filter(isValue)
      .map(value => serializeKeyValue(key, value)).join(" "),
  ).join(" ")

export const serializeNode = ({ id, labels, properties }) => [
  quoteId(id),
  serializeLabels(labels || []),
  serializeProperties(properties || {}),
].filter(s => s !== "").join(" ")

export const serializeEdge = ({ id, from, to, labels, properties, undirected }) => [
  id ? quoteId(id)+":" : "",
  quoteId(from),
  undirected ? "--" : "->",
  quoteId(to),
  serializeLabels(labels || []),
  serializeProperties(properties || {}),
].filter(s => s !== "").join(" ")

export const serialize = ({ nodes, edges }) => [
  ...(nodes||[]).filter(n => n.id !== "").map(serializeNode),
  ...(edges||[]).map(serializeEdge),
].join("\n") + "\n"
