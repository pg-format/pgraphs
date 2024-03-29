import pg from "./format/pg/index.js"
import json from "./format/pg-json/index.js"
import jsonl from "./format/pg-jsonl/index.js"
import cypher from "./format/cypher/index.js"
import dot from "./format/dot/index.js"
import tgf from "./format/tgf/index.js"
import graphml from "./format/graphml/index.js"
import graphology from "./format/graphology/index.js"
import canvas from "./format/canvas/index.js"
import gexf from "./format/gexf/index.js"
import cyjs from "./format/cyjs/index.js"

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
  canvas,
  graphology,
  neo4j: {
    name: "Neo4J server (via Cypher query)",
    parse: parseNeo4J,
  },
  xml: graphml,
  // graphmlz: { name: "Compressed GraphML" }
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
  gxl: {
    name: "Graph eXchange Language (GXL)",
    direction: "mixed", // TODO: multi-edges allowed?
    nodeTypes: "0/1",
    edgeTypes: "0/1",
    graphAttributes: true,
    nodeAttributes: true,
    edgeAttributes: true,
    datatypes: true,
    hyperEdges: true,
  },
  meermaid: {
    name: "Meermaid Flowchart",
    direction: "mixed", // TODO: multi-edges allowed
    nodeNames: "0/1",
    graphAttributes: false,
  },
  flat: {
    name: "Oracle Flat File Format",
    //    serialize: serializeFlat,
  },
  kuzudb: {
    name: "Kùzu Database",
  },
  dgml: {
    name: "Directed Graph Markup Language (DGML)"
  },
  gml: {
    name: "Graph Modelling Language (GML)" 
  },
  gexf,
  // dotml: { name:"DotML" },
  pgx: {
    name: "Orcacle PGX Flat File format"
  },
  xgml: { name: "Graph Modeling Language XML (XGML)" },
  tp2: { name: "GraphSON TinkerPop 2" },
  tp3: { name: "GraphSON TinkerPop 3" },
  net: { name: "Pajek NET" },
  gdf: { name: "Graph Definition File (GDF)" },
  dl: { name: "UCINET DL" },
  tp: { name: "Tulip TP" },
  vna: { name: "Netdraw VNA" },
  yed: { name: "yED CSV" },
  cyjs,
}

