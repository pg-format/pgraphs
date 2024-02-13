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
 
