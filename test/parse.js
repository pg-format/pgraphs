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
 
const invalid = [
  "\"",
  "\"\"",   // empty node id
  "x :", // empty label
]

describe("parsing errors", () => {
  for(let fails of invalid) {
    it(fails, () => {
      assert.throws(() => parse(fails))
    })
  }
})
