#!/usr/bin/env node

import fs from "fs"
import neo4j from "neo4j-driver"
import { serializeNode, serializeEdge } from "../src/serializer/pg.js"

// read configuration
const config = process.argv[2]
if (!fs.existsSync(config)) {
  console.error("Please provide a JSON file with NEO4J server uri, user, password!")
  process.exit(1)
}

const server = JSON.parse(fs.readFileSync(config))

// initialize database connection
const driver = neo4j.driver(
  server.uri,
  neo4j.auth.basic(server.user, server.password),
  { disableLosslessIntegers: true }, // convert large integers to JavaScript (FIXME?)
)
const session = driver.session({ defaultAccessMode: neo4j.session.READ })

const onError = error => { 
  console.log(error.message)
  process.exit(1)
}

// map internal node ids to numbers
var nodeCount = 0
const nodeId = {}

// TODO handle all data types
const propertiesMustHaveArrayValues = properties => {
  for (const [key, value] of Object.entries(properties)) {
    const values = Array.isArray(value) ? value : [ value ]
    properties[key] = values

  }
}

const processNode = ({ labels, properties, elementId }) => {
  propertiesMustHaveArrayValues(properties)

  const node = {
    id: (nodeId[elementId] = ++nodeCount),
    labels,
    properties, 
  }

  console.log(serializeNode(node))
}

const processEdge = ({ type, properties, startNodeElementId, endNodeElementId }) => {
  propertiesMustHaveArrayValues(properties)

  const edge = {
    from: nodeId[startNodeElementId],
    to: nodeId[endNodeElementId],
    labels: [type],
    properties,
  }

  console.log(serializeEdge(edge))
}

session.run("MATCH (n) RETURN n").subscribe({
  onError, onNext: record => processNode(record.get("n")),
  onCompleted: () => {
    console.log("")
    session.run("MATCH ()-[r]->() RETURN r").subscribe({
      onError, onNext: record => processEdge(record.get("r")),
      onCompleted: async () => session.close().then(() => driver.close()),
    })
  },
})
