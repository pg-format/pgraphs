const plainId = /^[^#"\s:(<>{}|^-][^\s"<>{}|^]*$/

export const quoteId = s => plainId.test(s) && !/--/.test(s) ? s : JSON.stringify(s)

export const quoteKey = s => plainId.test(s) && !/--/.test(s) ? s : JSON.stringify(s)

const valuePattern = /["\s,:]|^(-?[0-9]+(\.[0-9]+)?|true|false)$|^\(|\)$/

const quoteValue = s => ((typeof s === "string" && s !== "" && !valuePattern.test(s)) ? s : JSON.stringify(s))

export const serializeLabels = labels => labels.map(label => ":" + quoteId(label)).join(" ")

const serializeKeyValue = (key, value) => 
  quoteKey(key) + ":" + (key.match(/:/) ? " " : "") + quoteValue(value)

export const serializeProperties = properties => Object.entries(properties)
  .map(([key, values]) => values.map(value => serializeKeyValue(key, value)).join(" "),
  ).join(" ")

export const serializeNode = ({ id, labels, properties }) => [
  quoteId(id),
  serializeLabels(labels || []),
  serializeProperties(properties || {}),
].filter(s => s !== "").join(" ")

export const serializeEdge = ({ from, to, labels, properties, undirected }) => [
  quoteId(from),
  undirected ? "--" : "->",
  quoteId(to),
  serializeLabels(labels || []),
  serializeProperties(properties || {}),
].filter(s => s !== "").join(" ")

export const serialize = ({ nodes, edges }) => [
  ...nodes.map(serializeNode),
  ...edges.map(serializeEdge),
].join("\n") + "\n"
