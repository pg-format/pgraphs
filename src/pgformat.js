import parse from "./parser/pg.js"

import parseNdjson from "./parser/pg-ndjson.js"
import serializeNdjson from "./serializer/ndjson.js"

import parseDot from "./parser/dot.js"
import serializeDot from "./serializer/dot.js"

import serializeGraphML from "./serializer/graphml.js"
import serializeYARSPG from "./serializer/yarspg.js"

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
    name: "YARS-PG 3.0.0 with optional labels",
    serialize: serializeYARSPG,
  },
}
