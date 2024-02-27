/**
 * Supported Graph Serialization Formats and Graph Database:
 *
 * | read | write | format or database                      |
 * |------|-------|-----------------------------------------|
 * | yes  | yes   | PG format                               |
 * | yes  | yes   | PG-JSON                                 |
 * | yes  | yes   | PG-NDJSON                               |
 * | yes  | yes   | GraphViz DOT                            |
 * |      | yes   | YARS-PG                                 |
 * | yes  | yes   | Trivial Graph Format (TGF)              |
 * |      | yes   | GraphML                                 |
 * |      | yes   | OpenCypher/Neo4J CSV import             |
 * |      | yes   | Amazon Neptune CSV import               |
 * | yes  |       | Cypher query                            |
 * |      |       | Orcacle PGX Flat File format            |
 * |      |       | KuzuDB                                  |
 * |      |       | Directed Graph Markup Language (DGML)   |
 * |      |       | DotML                                   |
 * |      |       | S-Dot                                   |
 * |      |       | Graph eXchange Language (GXL)           |
 * |      |       | Graph Modelling Language (GML)          |
 * |      |       | Graph Modeling Language XML (XGML)      |
 * |      |       | GraphSON TinkerPop 2                    |
 * |      |       | GraphSON TinkerPop 3                    |
 * |      |       | Graph Exchange XML Format (GEXF)        |
 * |      |       | Pajek NET                               |
 * |      |       | Graph Definition File (GDF)             |
 * |      |       | UCINET DL                               |
 * |      |       | Tulip TP                                |
 * |      |       | Netdraw VNA                             |
 * | no   | no    | yFiles Graph Format                     |
 *
 * In addition there is compressed GraphML (`.graphmlz`) and CSV as supported
 * by yED: https://yed.yworks.com/support/manual/import_excel.html
 */

import { parse } from "./parser/pg.js"

import parseNdjson from "./parser/pg-ndjson.js"
import serializeNdjson from "./serializer/ndjson.js"

import parseDot from "./parser/dot.js"
import serializeDot from "./serializer/dot.js"

import serializeGraphML from "./serializer/graphml.js"
import serializeYARSPG from "./serializer/yarspg.js"
import serializeYARSPG3 from "./serializer/yarspg3.js"
import serializeCSV from "./serializer/csv.js"
import serializeNeptune from "./serializer/neptune.js"
//import serializeFlat from "./serializer/flat.js"
import parseTGF from "./parser/tgf.js"
import serializeTGF from "./serializer/tgf.js"

import parseNeo4J from "./parser/neo4j.js"

import { serialize } from "./serializer/pg.js"

export const pgformat = {
  pg: {
    name: "PG format (default input)",
    parse: function(text) {
      try {
        return parse(text) 
      } catch(e) {
        const { line, column } = e.location.start
        throw new Error(`${e.message} Line ${line}:${column}.`)
      }
    },
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
  tgf: {
    name: "Trivial Graph Format",
    parse: parseTGF,
    serialize: serializeTGF,
  },
  neo4j: {
    name: "Neo4J server (via Cypher query)",
    parse: parseNeo4J,
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
  neptune: {
    name: "Neptune CSV import (aka Gremlin load data format)",
    serialize: serializeNeptune,
  },
//  flat: {
//    name: "Oracle Flat File Format (experimental)",
//    serialize: serializeFlat,
//  },
}
