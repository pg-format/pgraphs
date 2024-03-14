import pg from "./format/pg/index.js"
import json from "./format/pg-json/index.js"
import jsonl from "./format/pg-jsonl/index.js"
import cypher from "./format/cypher/index.js"
import dot from "./format/dot/index.js"
import tgf from "./format/tgf/index.js"
import graphml from "./format/graphml/index.js"

import serializeYARSPG from "./serializer/yarspg.js"
import serializeYARSPG3 from "./serializer/yarspg3.js"
import serializeCSV from "./serializer/csv.js"
import serializeNeptune from "./serializer/neptune.js"
// Import serializeFlat from "./serializer/flat.js"

import parseNeo4J from "./parser/neo4j.js"

export const pgformat = {
  pg,
  json,
  jsonl,
  cypher,
  dot,
  tgf,
  neo4j: {
    name: "Neo4J server (via Cypher query)",
    parse: parseNeo4J,
  },
  xml: graphml,
  yarspg: {
    name: "YARS-PG 5.0.0 without data types",
    serialize: serializeYARSPG,
  },
  yarspg3: {
    name: "YARS-PG 3.0.0 with optional labels",
    serialize: serializeYARSPG3,
  },
  csv: {
    name: "OpenCypher/Neo4J CSV files",
    serialize: serializeCSV,
  },
  neptune: {
    name: "Neptune CSV import (aka Gremlin load data format)",
    serialize: serializeNeptune,
  },
//  Flat: {
//    name: "Oracle Flat File Format (experimental)",
//    serialize: serializeFlat,
//  },
}

pgformat.pg.name += " (default input)"
pgformat.jsonl.name += " (default output)"
