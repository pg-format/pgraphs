import { assert } from "chai"
import fs from "fs"
import path from "path"

import pgFormat from "../src/format/pg/index.js"
const { parse } = pgFormat

const suite = path.resolve(new URL(".", import.meta.url).pathname, "pg-test-suite")
const suitePath = (...name) => path.resolve(suite, ...name)
const suiteFile = (...name) => fs.readFileSync(suitePath(...name)).toString()

const examples = fs.readdirSync(suitePath("examples")).filter(file => file.match(/\.pg/))
describe("parse examples", () => {
  for(let file of examples) {
    it(file, () => {
      const pg = suiteFile("examples",file)
      const parsed = parse(pg)
      const jsonFile = suitePath("examples",file.replace(/\.pg$/, ".json"))
      if (fs.existsSync(jsonFile)) {
        const json = JSON.parse(suiteFile(jsonFile))
        assert.deepEqual(parsed, json)
      }
    })
  }
})

const valid = JSON.parse(suiteFile("pg-format-valid.json"))
describe("parse valid test cases", () => {
  valid.forEach(({pg,about,graph}) => {
    it(about, () => { 
      const parsed = parse(pg)
      if (graph) {
        assert.deepEqual(parsed, graph)
      }
    })
  })
})

const invalid = JSON.parse(suiteFile("pg-format-invalid.json"))
describe("detect errors in invalid test cases", () => {
  for (let pg in invalid) {
    it(invalid[pg], () => assert.throws(() => parse(pg)))
  }
})

