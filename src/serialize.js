const quote = s => /"|\s/.test(s) ? JSON.stringify(s) : s
const quoteKey = s => /"|:|\s/.test(s) ? JSON.stringify(s) : s

export const serializeLabels = labels =>
  labels.map(label => ":" + quote(label)).join(" ")

export const serializeProperties = properties =>
  Object.entries(properties)
    .map(([key,values]) => 
      values.map(value => quote(key) + ":" + quote(value)).join(" "),
    ).join(" ")

export const serializeNode = ({id, labels, properties}) => [
  quote(id),
  serializeLabels(labels || []),
  serializeProperties(properties || {}),
].filter(s => s!== "").join(" ")

export const serializeEdge = ({from, to, labels, properties, undirected}) => [
  quote(from),
  undirected ? "--" : "->",
  quoteKey(to),
  serializeLabels(labels || []),
  serializeProperties(properties || {}),
].filter(s => s!== "").join(" ")

export const serialize = ({nodes, edges}) => [
  ...nodes.map(serializeNode),
  ...edges.map(serializeEdge),
].join("\n")
