import { assert } from "chai"
import fs from "fs"
import { localPath, readFile } from "./utils.js"
import { parse } from "../index.js"

describe("parse", () => {
  fs.readdirSync(localPath("../examples")).forEach(file => {
    if (file.match(/\.pg$/)) {
      it(file, () => {
        const pgstring = readFile(`../examples/${file}`)
        const graph = parse(pgstring)
        const jsonFile = localPath(`../examples/${file.replace(/\.pg$/,".json")}`)
        if (fs.existsSync(jsonFile)) {
          const json = JSON.parse(readFile(jsonFile))
          assert.deepEqual(graph,json)
        } else {
          console.log(JSON.stringify(graph))
        }
      })
    }
  })
})
 
const valid = [
  "\"\"",       // empty node id
  "a\rb",       // plain /r is newline
  "a:b",
]

describe("parsing more edge cases", () => {
  for(let pg of valid) {
    it("is valid", () => {
      assert.ok(parse(pg))
    })
  }
})

const invalid = [
  "\"",
  "x :",        // missing label
  "\"\\",       // malformed escaped string
  "\"\\\\\"\"", // malformed escaped string
  " a",         // line must not start with spaces
  "a b:c:d",    // property with ambiguous separation of key and value
  "a:",         // node id starting or ending with color
  ":a",
  "a\"b",
]

describe("parsing errors", () => {
  for(let fails of invalid) {
    it(fails, () => {
      assert.throws(() => parse(fails))
    })
  }
})

describe("special whitespace characters", () => {
  const whitespace = {
    "vertical tab": "\v",
    "form feed": "\f",
    "non-break space": "\xA0",
    "zero-width space": "\uFEFF",
  }
  for(let [name,space] of Object.entries(whitespace)) {
    it(name, () => {
      const id = `x${space}:y`
      const graph = { nodes: [{ id, labels: [], properties: {} }], edges: [] }
      assert.deepEqual(parse(id),graph)
    })
  }
})

