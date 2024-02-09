#!/usr/bin/env node

import fs from "fs"
import { serialize } from "../index.js"

const from = process.argv.length > 2 ?
  fs.createReadStream(process.argv[2]) : process.stdin

const chunks = []
for await (let chunk of from) {
  chunks.push(chunk)
}
const input = chunks.map(s => s.toString()).join("")

try {
  const graph = JSON.parse(input)
  process.stdout.write(serialize(graph))
} catch(e) {
  console.error(e.toString())
  process.exit(1)
}
