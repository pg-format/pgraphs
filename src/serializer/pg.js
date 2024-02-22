
// PLAIN ::= PLAINCHAR ( ( CHAR - ( SPACE | '"' | ',' ) )* PLAINCHAR )?
const plainChar = "[^\\s\":,()\\]\\[{}<>]"
const plain = new RegExp(`^${plainChar}([^\\s",]*${plainChar})?$`)

export const quoteLabel = s => plain.test(s) ? s : JSON.stringify(s)

export const quoteKey = s => /[":\s(),]|^$/.test(s) ? JSON.stringify(s) : s

const valuePattern = /["\s,]|^(-?[0-9]+(\.[0-9]+)?|true|false|null)$|^\(|\)$/

const quoteValue = s =>  
  (typeof s === "string" && s !== "" && !valuePattern.test(s)) ? 
    (s.match(/:/) ? " " + s : s) 
    : JSON.stringify(s)

export const serializeLabels = labels =>
  labels.map(label => ":" + quoteLabel(label)).join(" ")

const serializeKeyValue = (key, value) =>
  quoteKey(key) + ":" + quoteValue(value)

export const serializeProperties = properties => 
  Object.entries(properties)
    .map(([key,values]) => 
      values.map(value => serializeKeyValue(key,value)).join(" "),
    ).join(" ")

export const serializeNode = ({id, labels, properties}) => [
  quoteLabel(id),
  serializeLabels(labels || []),
  serializeProperties(properties || {}),
].filter(s => s!== "").join(" ")

export const serializeEdge = ({from, to, labels, properties, undirected}) => [
  quoteLabel(from),
  undirected ? "--" : "->",
  quoteKey(to),
  serializeLabels(labels || []),
  serializeProperties(properties || {}),
].filter(s => s!== "").join(" ")

export const serialize = ({nodes, edges}) => [
  ...nodes.map(serializeNode),
  ...edges.map(serializeEdge),
].join("\n")+"\n"
