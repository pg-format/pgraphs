import { IDMap } from "../utils.js"

// TODO: import via promise
import neo4j from "neo4j-driver-lite"

// TODO handle all data types
const propertiesMustHaveArrayValues = properties => {
  for (const [key, value] of Object.entries(properties)) {
    const values = Array.isArray(value) ? value : [value]
    properties[key] = values

  }
}

export default async json => {
  const config = JSON.parse(json)
  const driver = neo4j.driver(
    config.uri,
    neo4j.auth.basic(config.user, config.password),
    { disableLosslessIntegers: true }, // convert large integers to JavaScript (FIXME?)
  )
  const session = driver.session({ defaultAccessMode: neo4j.session.READ })

  const ids = new IDMap()
  const nodes = []; const edges = []

  const processNode = ({ labels, properties, elementId }) => {
    propertiesMustHaveArrayValues(properties)
    nodes.push({
      id: ids.map(elementId),
      labels,
      properties,
    })
  }

  const processEdge = ({ type, properties, startNodeElementId, endNodeElementId }) => {
    propertiesMustHaveArrayValues(properties)
    edges.push({
      from: ids.map(startNodeElementId),
      to: ids.map(endNodeElementId),
      labels: [type],
      properties,
    })
  }

  const query = `MATCH (n)
OPTIONAL MATCH (n)-[r]-(m)
RETURN COLLECT(DISTINCT n) AS nodes, COLLECT(DISTINCT r) AS edges`

  return new Promise((resolve, onError) => {
    session.run(query).subscribe({
      onNext: record => {
        record.get("nodes").forEach(processNode)
        record.get("edges").forEach(processEdge)
      },
      onError,
      onCompleted: async() => session.close().then(() => driver.close()).then(() => resolve({ nodes, edges })),
    })
  })
}
