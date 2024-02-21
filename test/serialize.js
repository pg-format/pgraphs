import { assert } from "chai"
import fs from "fs"
import { localPath, readFile } from "./utils.js"
import { pgformat } from "../index.js"
import { StringTargets } from "../src/target.js"

const { parse, serialize } = pgformat.pg

describe("serialize PG", () => {
  fs.readdirSync(localPath("../examples")).forEach(file => {
    if (file.match(/\.json$/)) {
      it(file, () => {
        const graph = JSON.parse(readFile(`../examples/${file}`))
        assert.deepEqual(parse(serialize(graph)), graph)
      })
    }
  })

  const graph = {
    nodes: [{ id: "1", labels: ["a"], properties: { a: ["b"], x: ["y z"], "x:y": ["z"] }}],
    edges: [], 
  }
  assert.equal(serialize(graph), "1 :a a:b x:\"y z\" \"x:y\":z\n")
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
    const { serialize } = pgformat[type] || {}
    const graph = graphs[`${name}.json`]
    if (graph && serialize && !/^(json|ndjson|pg)$/.test(type)) {
      it(file, () => {
        const s = serialize(graph)
        assert.equal( readFile(`../examples/${file}`), s )
      })
    }
  }
})

describe("serialize multifile formats", () => {
  for (let format of files.filter(file => !file.match(/[.]/))) {
    const name = "example"
    if (pgformat[format]?.serialize) {
      it(`${name} in ${format}`, () => {
        const graph = graphs[`${name}.json`]
        const target = new StringTargets()
        pgformat[format].serialize(graph, target)
        fs.readdirSync(localPath(`../examples/${format}`)).forEach(file => {
          assert.equal(target.result[file.substr(name.length)], readFile(`../examples/${format}/${file}`))
        })
      })
    }
  }
})

