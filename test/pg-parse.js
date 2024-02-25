import { assert } from "chai"
import fs from "fs"
import { localPath, readFile } from "./utils.js"
import { pgformat, ParsingError } from "../index.js"

const { parse } = pgformat.pg

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
          // console.log(JSON.stringify(graph))
        }
      })
    }
  })
})
 
const empty = { labels: [], properties: {} }
const valid = {
  // empty node id
  "\"\"": { nodes: [{ id: "", ...empty }], edges: [] },
  // plain /r is newline
  "a\rb": { nodes: [{ id: "a", ...empty }, { id: "b", ...empty }], edges: [] },
  "a:b <- a:b": {
    nodes: [ { id: "a:b", ...empty } ],
    edges: [ { from: "a:b", to: "a:b", ...empty } ],
  },
  // id can end with colon and contain special characters:
  "a,;(\": -> b\":,;:": {
    nodes: [ { id: "a,;(\":", ...empty }, { id: "b\":,;:", ...empty } ],
    edges: [ { from: "a,;(\":", to: "b\":,;:", labels: [], properties: {} } ],
  },
}

describe("parsing more edge cases", () => {
  for(let [pg, graph] of Object.entries(valid)) {
    it("is valid", () => assert.deepEqual(parse(pg),graph))
  }
})

const invalid = {
  "\"": "line 1 must start with node or edge",
  "\"\\": "line 1 must start with node or edge", // malformed escaped string
  "\"\\\\\"\"": "invalid node identifier at line 1 character 5 is \"",
  ":a": "node identifier must not start with colon at line 1",
  " a": "line 1 must not start with whitespace",
  "x :": "invalid label or property key at line 1, character 3 is :",
  "x -": "invalid label or property key at line 1, character 3 is -",
  "x k:": "missing property value at line 1, character 5",
  "x k:\"xy": "invalid property value at line 1, character 5: \"\\\"xy\"",
  "a b:c:d": "invalid content at line 1, character 6: \":d\"",
  "(a": "line 1 must start with node or edge",
  //"a:;b": "invalid node identifier at line 1",
  //"a:": "invalid node identifier at line 1 character 2 is :",
}

describe("parsing errors", () => {
  for(let [input, error] of Object.entries(invalid)) {
    it(input, () => {
      assert.throws(() => parse(input), ParsingError, error)
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

