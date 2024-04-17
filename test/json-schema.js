import { assert } from "chai"
import fs from "fs"
import { localPath, readFile } from "./utils.js"
import Ajv from "ajv"

const ajv = new Ajv()
const jsonSchema = JSON.parse(readFile("../schema/pg-json.json"))
const jsonlSchema = JSON.parse(readFile("../schema/pg-jsonl.json"))
const validateJson = ajv.compile(jsonSchema)
const validateJsonl = ajv.compile(jsonlSchema)

describe("valid PG-JSON(L)", () => {
  fs.readdirSync(localPath("../examples")).forEach(file => {
    if (file.match(/\.json$/)) {
      it(file, () => {
        const graph = JSON.parse(readFile(`../examples/${file}`))
        const ok = validateJson(graph)
        if (!ok) { console.log(validateJson.errors) }
        assert.ok(ok)
      })
    } else if (file.match(/\.jsonl$/)) {
      const lines = readFile(`../examples/${file}`).split("\n").filter(l => l !== "")
      for (var i=0; i<lines.length; i++) {
        const graph = JSON.parse(lines[i])
        it(`${file} line ${i+1}`, () => {
          const ok = validateJsonl(graph)
          if (!ok) { console.log(validateJsonl.errors) }
          assert.ok(ok)
        })  
      }
    }
  })
})

const node = id => ({ id, labels:[], properties: {} })

const invalid = [
  // Missing or additional fields
  {},
  { nodes:[], edges:[], X:1 },
  { nodes:[{}], edges:[] },
  { nodes:[], edges:[{}] },
  { nodes:[{ ...node("x"), X:1 }], edges:[] },
  { nodes:[node("x"), node("y")], edges:[{ from:"x", to:"y", labels:[], properties:{}, X:1 }] },
  { nodes:[{ id:"", labels:[], properties:{} }], edges:[] },
  { nodes:[{ id:"x", labels:[], properties:{ "":[1] } }], edges:[] },
]

const valid = [
  { nodes:[{ id:"x", labels:[], properties:{} }], edges:[] },
]

describe("more valid PG-JSON", () => {
  for (let i = 0; i < valid.length; i++) {
    it(String(i), () => {
      assert.ok(validateJson(valid[i]))
    })
  }
})

describe("invalid PG-JSON", () => {
  for (let i = 0; i < invalid.length; i++) {
    it(String(i), () => {
      assert.ok(!validateJson(invalid[i]))
    })
  }
})
