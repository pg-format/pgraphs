import fs from "fs"
import { pgformat } from "../src/formats.js"
import { GraphTarget, StreamTarget } from "../src/target.js"

// Read entire input to string
const readStream = async input => {
  const chunks = []
  for await (const chunk of input) {
    chunks.push(chunk)
  }
  return chunks.join("")
}

// Convert input stream to output stream
export async function pgraph(source, target, opts) {
  // alias
  if (opts.from === "ndjson") {opts.from = "jsonl"}
  if (opts.to === "ndjson") {opts.to = "jsonl"}
  const from = pgformat[opts.from || "pg"]
  const to = pgformat[opts.to || "jsonl"]

  if (!from) {
    throw new Error(`Unknown source format: ${opts.from}`)
  }
  if (!to) {
    throw new Error(`Unknown target format: ${opts.to}`)
  }

  if (typeof source === "string") {
    source = fs.createReadStream(source)
  }

  if (typeof target === "string") {
    if (!to.serialize.multi) {
      target = fs.createWriteStream(target)
    }
  } else if (to.serialize.multi) {
    target = new StreamTarget(target)
  }

  const writeGraph = graph => {
    if (typeof target === "string" || target instanceof GraphTarget) {
      to.serialize(graph, target)
    } else {
      target.write(to.serialize(graph))
    }
  }

  const graph = from.parse(await readStream(source))
  if (graph instanceof Promise) {
    return await graph.then(writeGraph)
  } else {
    writeGraph(graph)
  }
}
