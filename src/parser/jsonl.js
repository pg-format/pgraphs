// PG-NDJSON parser (non-validating)
export default input => {
  const nodes = []; const edges = []
  for (const line of input.split("\n").filter(line => line !== "")) {
    const json = JSON.parse(line);
    ("id" in json ? nodes : edges).push(json)
    // TODO: validate
  }
  return { nodes, edges }
}
