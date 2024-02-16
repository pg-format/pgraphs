#!/usr/bin/env node

import cli from "../src/cli.js"
import { pgraph } from "../src/pgraph.js"
import { pgformat } from "../index.js"

const formats = Object.keys(pgformat).map(id => {
  const { name, parse, serialize } = pgformat[id]
  return "  " + id.padEnd(8) + (parse ? "from" + (serialize ? "/" : "") 
    : "") + (serialize ? "to" : "") + " " + name
}).join("\n")

cli.usage("pgraph [options] [<input> [<output]]")
  .description("Convert between property graph serializations.")
  .option("-f, --from [format]   input format")
  .option("-t, --to [format]     output format")
  .option("-v, --verbose         verbose error messages")
  .details(`Supported conversion formats:\n${formats}`)
  .action(async (args, opt) => {

    // check arguments
    if (args.length > 2) {
      throw new Error("Too many arguments!")
    }
    args = [args[0] ?? "-", args[1] ?? "-"]
    const input = args[0] == "-" ? process.stdin : args[0]
    const output = args[1] == "-" ? process.stdout : args[1]

    // guess formats
    if (!opt.from && args[0].match(/\./)) { 
      opt.from = args[0].split(".").pop()
    }
    if (!opt.to && args[1].match(/\./)) {
      opt.to = args[1].split(".").pop()
    }

    return pgraph(input, output, opt)
  })
  .parse(process.argv)
  .catch(e => {
    console.error(cli.options.verbose ? e : `${e}`)
    process.exit(1)
  })
