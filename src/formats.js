import parse from "./parser/pg.js"

import parseNdjson from "./parser/pg-ndjson.js"
import serializeNdjson from "./serializer/ndjson.js"

import parseDot from "./parser/dot.js"
import serializeDot from "./serializer/dot.js"


import serializeGraphML from "./serializer/graphml.js"
import serializeYARSPG from "./serializer/yarspg.js"
import serializeYARSPG3 from "./serializer/yarspg3.js"
import serializeCSV from "./serializer/csv.js"
//import serializeFlat from "./serializer/flat.js"

/*const serializeTSV = (graph, target, opt) =>
  serializeCSV(graph, target, {...opt, delimiter: "\t", arrayDelimiter: "\x1F" })
serializeTSV.multi = true
*/

import parseNeo4J from "./parser/neo4j.js"

import { serialize } from "./serializer/pg.js"

export const pgformat = {
  pg: {
    name: "PG format (default input)",
    parse,
    serialize,
  },
  json: {
    name: "PG-JSON",
    parse: string => JSON.parse(string),
    serialize: graph => JSON.stringify(graph, null, 2),
  },
  ndjson: {
    name: "PG-NDJSON (default output)",
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
  csv: {
    name: "OpenCypher/Neo4J CSV files",
    serialize: serializeCSV,
  },
  //tsv: {
  //  name: "OpenCypher/Neo4J TSV files",
  //  serialize: serializeTSV,
  //},
  neo4j: {
    name: "Neo4J server (via config file)",
    parse: parseNeo4J,
  },
//  flat: {
//    name: "Oracle Flat File Format (experimental)",
//    serialize: serializeFlat,
//  },
}
