import { assert } from "chai"
import fs from "fs"
import { localPath, readExample } from "./utils.js"
import { pgformat } from "../index.js"
import { StringTargets } from "../src/target.js"

const { parse, serialize } = pgformat.pg

const files = fs.readdirSync(localPath("../examples"))

describe("serialize PG", () => {
  files.forEach(file => {
    if (file.match(/\.json$/)) {
      it(file, () => {
        const graph = JSON.parse(readExample(file))
        assert.deepEqual(parse(serialize(graph)), graph)
      })
    }
  })

  it("special examples", () => {
    const examples = {
      "1 :; a:b x:\"y z\" x:y: z": [{ id: "1", labels: [";"], properties: { a: ["b"], x: ["y z"], "x:y": ["z"] } }],
      "1:2 :\"[]\" )(:\",\"": [{ id: "1:2", labels: ["[]"], properties: { ")(":[","] } }],
      "": [{ id: "" }],
      x: [{ id: "x", properties: { y: null } }],
      "x y:1": [{ id: "x", properties: { y: [{},1,null] } }],
    }
    for (const [pg, nodes] of Object.entries(examples)) {
      assert.equal(serialize({ nodes }), pg + "\n")
    }
  })

  it("incomplete data", () => {
    const examples = [
      {}, 
      { nodes: [ { id: "a" } ] },
      { nodes: [ { id: "a", properties: { x: null } } ] }
    ]
    for (const g of examples) {
      assert.ok(serialize(g))
    }
  })
})

const graphs = Object.fromEntries(
  files.filter(f => f.match(/\.pg$/)).map(file => [
    file.slice(0,-3), parse(readExample(file)),
  ]),
)

describe("serialize lossy formats", () => {
  for (const file of files) {
    const [name, type] = file.split(".")
    const { parse, serialize } = pgformat[type] || {}
    const graph = graphs[name]
    if (graph && serialize && !/^(json|pg)$/.test(type)) {
      it(file, () => {
        const s = serialize(graph)
        assert.equal(readExample(file), s)
      })
      if (parse) {
        it(`parse ${file}`, () => {
          assert.ok(parse(readExample(file))?.nodes.length)
        })
      }
    }
  }
})

describe("serialize multifile formats", () => {
  for (const format of files.filter(file => !file.match(/[.]/))) {
    const name = "example"
    if (pgformat[format]?.serialize) {
      it(`${name} in ${format}`, () => {
        const graph = graphs[name]
        const target = new StringTargets()
        pgformat[format].serialize(graph, target)
        fs.readdirSync(localPath(`../examples/${format}`)).forEach(file => {
          assert.equal(target.result[file.substr(name.length)], readExample(`${format}/${file}`))
        })
      })
    }
  }
})
