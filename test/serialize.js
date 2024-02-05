import { assert } from "chai"
import fs from "fs"
import { localPath, readFile } from "./utils.js"
import { parse, serialize } from "../index.js"

describe("serialize", () => {
  fs.readdirSync(localPath("../examples")).forEach(file => {
    if (file.match(/\.json$/)) {
      it(file, () => {
        const graph = JSON.parse(readFile(`../examples/${file}`))
        assert.deepEqual(parse(serialize(graph)), graph)
      })
    }
  })
})
 
