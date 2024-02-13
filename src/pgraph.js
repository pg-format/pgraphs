import { pgformat } from "../src/pgformat.js"

// read entire input to string
const readStream = async input => {
  const chunks = []
  for await (let chunk of input) {
    chunks.push(chunk)
  }
  return chunks.join("")
}

// convert input stream to output stream
export async function pgraph(input, output, opts) {
  const from = pgformat[opts.from || "pg"]
  const to = pgformat[opts.to || "json"]

  if (!from) {
    throw new Error(`Unknown input format: ${opts.from}`)
  }
  if (!to) {
    throw new Error(`Unknown output format: ${opts.to}`)
  }

  const graph = from.parse(await readStream(input))
  output.write(to.serialize(graph))
}
