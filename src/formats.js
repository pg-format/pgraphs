import parse from "./parser/pg.js"

import parseNdjson from "./parser/pg-ndjson.js"
import serializeNdjson from "./serializer/ndjson.js"

import parseDot from "./parser/dot.js"
import serializeDot from "./serializer/dot.js"


import serializeGraphML from "./serializer/graphml.js"
import serializeYARSPG from "./serializer/yarspg.js"
import serializeYARSPG3 from "./serializer/yarspg3.js"
import serializeNeoCSV from "./serializer/neocsv.js"
//import serializeFlat from "./serializer/flat.js"

import parseNeo4J from "./parser/neo4j.js"

import { serialize } from "./serializer/pg.js"

export const pgformat = {
  pg: {
    name: "PG format",
    parse,
    serialize,
  },
  json: {
    name: "PG-JSON",
    parse: string => JSON.parse(string),
    serialize: graph => JSON.stringify(graph, null, 2),
  },
  ndjson: {
    name: "PG-NDJSON",
    parse: parseNdjson,
    serialize: serializeNdjson,
  },
  dot: {
    name: "GraphViz dot",
    parse: parseDot,
    serialize: serializeDot,
  },
  xml: {
    name: "GraphML",
    serialize: serializeGraphML,
  },
  yarspg: {
    name: "YARS-PG 5.0.0 without data types",
    serialize: serializeYARSPG,
  },
  yarspg3: {
    name: "YARS-PG 3.0.0 with optional labels",
    serialize: serializeYARSPG3,
  },
  neocsv: {
    name: "Neo4J CSV import files (experimental)",
    serialize: serializeNeoCSV,
  },
  neo4j: {
    name: "Neo4J server (via config file)",
    parse: parseNeo4J,
  },
//  flat: {
//    name: "Oracle Flat File Format (experimental)",
//    serialize: serializeFlat,
//  },
}
