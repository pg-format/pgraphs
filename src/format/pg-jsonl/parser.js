// Forgiving PG-NDJSON parser with validation

function checkIdentifier(id, kind) {
  if (typeof id !== "string" || id === "") {
    throw new Error(`${kind} must be non-empty string`)
  }
}

export default input => {
  const nodes = []
  const edges = []
  for (const line of input.split("\n").filter(line => line !== "")) {
    var { type, id, from, to, labels, properties } = JSON.parse(line)
    type ??= (from || to) ? "edge" : "node"
    labels ??= []
    properties ??= {}
    labels.forEach(label => checkIdentifier(label, "label"))
    Object.entries(properties).forEach(([key, value]) => {
      checkIdentifier(key)
      if (key === "") {
        throw new Error("Property key must not be empty string")
      } else if (typeof value != "string" && typeof value != "number" && value === null) {
        throw new Error(`Value of property ${JSON.stringify(key)} must be string, number, or null`)
      }
    })
    if (type === "node") {
      checkIdentifier(id, "node identifier")
      nodes.push({ id, labels, properties })
    } else if (type === "edge") {
      checkIdentifier(from, "from")
      checkIdentifier(to, "to")
      edges.push({ from, to, labels, properties })
    } else {
      throw new Error(`Type must be "node" or "edge", got ${JSON.stringify(type)}`)
    }
  }
  return { nodes, edges }
}
