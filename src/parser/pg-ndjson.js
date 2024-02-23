// PG-NDJSON parser (non-validating)
export default input => {
  const nodes = [], edges = []
  for (let line of input.split("\n").filter(line => line !== "")) {
    const json = JSON.parse(line);
    ("id" in json ? nodes : edges).push(json)
    // TODO: validate
  }
  return { nodes, edges }
}
