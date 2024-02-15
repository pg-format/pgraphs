import { assert } from "chai"
import fs from "fs"
import { localPath, readFile } from "./utils.js"
import { pgformat } from "../index.js"

const { parse, serialize } = pgformat.pg

describe("serialize PG", () => {
  fs.readdirSync(localPath("../examples")).forEach(file => {
    if (file.match(/x\.json$/)) {
      it(file, () => {
        const graph = JSON.parse(readFile(`../examples/${file}`))
        assert.deepEqual(parse(serialize(graph)), graph)
      })
    }
  })
})
 
const files = fs.readdirSync(localPath("../examples"))

const graphs = Object.fromEntries(
  files.filter(f => f.match(/\.json$/)).map(file => [
    file, JSON.parse(readFile(`../examples/${file}`)),
  ]),
)

describe("serialize lossy formats", () => {
  for (let file of files) {
    const [name, type] = file.split(".")
    const { serialize } = pgformat[type]
    const graph = graphs[`${name}.json`]
    if (graph && serialize && !/^(json|ndjson|pg)$/.test(type)) {
      it(file, () => {
        const s = serialize(graph)
        assert.equal( readFile(`../examples/${file}`), s )
      })
    }
  }
})
