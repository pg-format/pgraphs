#!/usr/bin/env node

import fs from "fs"
import cli from "../src/cli.js"
import { parse, serialize } from "../index.js"

const formats = {
  pg: "PG format",
  json: "PG-JSON",
  ndjson: "PG-NDJSON",
}

async function pgraph(input, output, opts) {
  const from = opts.from || "pg"
  const to = opts.to || "json"

  // read entire input (unless streaming conversion has been implemented)
  const chunks = []
  for await (let chunk of input) {
    chunks.push(chunk)
  }
  input = chunks.join("")

  var graph
  if (from == "json") {
    graph = JSON.parse(input)
  } else if (from  == "pg") {
    graph = parse(input)
  } else if (from == "ndjson") {
    const nodes = [], edges = []
    for (let line of input.split("\n").filter(line => line !== "")) {
      const json = JSON.parse(line);
      ("id" in json ? nodes : edges).push(json)
    }
    graph = { nodes, edges }
  }

  if (to == "pg") {
    output.write(serialize(graph))
  } else if (to == "json") {
    output.write(JSON.stringify(graph, null, 2))
  } else if (to == "ndjson") {
    // TODO: add type to support import in Neo4J?
    for (let node of graph.nodes) {
      output.write(JSON.stringify(node)+"\n")
    }
    for (let edge of graph.edges) {
      output.write(JSON.stringify(edge)+"\n")
    }
  }
}

cli.usage("pgraph [options] [<input> [<output]]")
  .description("Convert between property graph serializations.")
  .option("-f, --from [format]   input format (pg|json|ndjson)")
  .option("-t, --to [format]     output format (pg|json|ndjson)")
  .option("-v, --verbose         verbose error messages")
  .action(async (args, opt) => {
    if (args.length > 2) throw new Error("Too many arguments!")
    args = [args[0] ?? "-", args[1] ?? "-"]
    const input = args[0] == "-" ?  process.stdin : fs.createReadStream(args[0])
    const output = args[1] == "-" ?  process.stdout : fs.createReadStream(args[0])

    // guess and check formats
    ;["from","to"].forEach((key, i) => {
      if (!opt[key] && args[i].match(/\./)) {
        opt[key] = args[i].split(".").pop()
      }
      if (opt[key] && !(opt[key] in formats)) {
        throw new Error(`Unknwon ${key} format: ${opt[key]}`)
      }
    })

    return pgraph(input, output, opt)
  })
  .parse(process.argv)
  .catch(e => {
    console.error(cli.options.verbose ? e : `${e}`)
    process.exit(1)
  })
