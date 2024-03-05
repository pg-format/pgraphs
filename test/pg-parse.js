import { assert } from "chai"
import fs from "fs"
import { localPath, readFile } from "./utils.js"

import { parse } from "../src/parser/pg.js"

describe("parse", () => {
  fs.readdirSync(localPath("../examples")).forEach(file => {
    if (file.match(/\.pg$/)) {
      it(file, () => {
        const pgstring = readFile(`../examples/${file}`)
        const g = parse(pgstring)
        const jsonFile = localPath(`../examples/${file.replace(/\.pg$/, ".json")}`)
        if (fs.existsSync(jsonFile)) {
          const json = JSON.parse(readFile(jsonFile))
          assert.deepEqual(g, json)
        } else {
          // Console.log(JSON.stringify(g))
        }
      })
    }
  })
})

// Lazy graph constructor
const graph = (nodes, edges = []) => {
  nodes = nodes.map(id => (typeof id === "string" ? { id } : id))
  edges = edges.map(e => (Array.isArray(e) ? { from: e[0], to: e[1] } : e)) 
  for (const e of [...nodes, ...edges]) {
    e.labels ??= []
    e.properties ??= {} 
    for (const [key, value] of Object.entries(e.properties)) {
      if (!Array.isArray(value)) {
        e.properties[key] = [value]
      }
    }
  }
  return { nodes, edges }
}

const valid = {
  "": graph([]),
  "#": graph([]),
  "\"\"": graph([""]),                                  // Empty node id
  "a\rb": graph(["a", "b"]),                             // Plain /r is newline
  "a:b <- c:": graph(["a:b", "c:"], [["c:", "a:b"]]),    // Id can contain and end colon
  "a(:# -> ->": graph(["->", "a(:#"], [["a(:#", "->"]]), // Id can contain special characters
  "x\nxy\r\nxyz # comment\n\"X\"": graph(["X", "x", "xy", "xyz"]), // Node ids
  // labels and line folding
  "n1 \n  :label:x  :y #comment\n\t :a :a": graph([{ id:"n1", labels:["label:x", "y", "a"] }]),
  "a : x b:1": graph([{ id:"a", labels: ["x"], properties:{ b:1 } }]),
  // Properties
  "x a:0 ab:false a:b:c a:b:4 \"(\":5 \"\":6": graph([{ id:"x",
    properties:{ a:0, ab:false, "a:b":["c", 4], "(":5, "":6 } }]),
  // Values
  "a -> b a:\"\",2\t, -2e2,null ,\n xyz # comment": graph(
    ["a", "b"],
    [{ from: "a", to: "b", labels: [], properties: { a: ["", 2, -200, null, "xyz"] } }],
  ),
  // FIXME: comment read as property???
  // "a b:c:d": "invalid content at line 1, character 6: \":d\"",
  //  'x :y :yz :x:z: :"y" :""',  // {"nodes":[{"id":"x","labels":["y","yz","x:z:","y",""],"properties":{}}],"edges":[]}
  // TODO:
  "a:0 a:0 a:0": graph([{ id:"a:0", properties:{ a:0 } }]),
  // "ab ->  b x:1 c:false",
  // "0 bc:d": graph([{id:"0",properties:{}}]),
  //  `101 :person name:Alice name:Carol country:"United States"`: graph([])
  "a -> b ; a :foo ;;a :bar": graph([{id:"a",labels:["foo","bar"]},{id:"b"}],[{from:"a",to:"b"}]),
}

describe("parsing valid short examples", () => {
  for (const [pg, g] of Object.entries(valid)) {
    it("is valid", () => assert.deepEqual(parse(pg), g))
  }
})

const invalid = {
  ",": "",
  "a ::": "",
  "a\"": "",
  "\"": "line 1 must start with node or edge",
  "\"\\": "line 1 must start with node or edge", // Malformed escaped string
  "\"\\\\\"\"": "invalid node identifier at line 1 character 5 is \"",
  ":a": "node identifier must not start with colon at line 1",
  " a": "line 1 must not start with whitespace",
  "x :": "invalid label or property key at line 1, character 3 is :",
  "x -": "invalid label or property key at line 1, character 3 is -",
  "x k:": "missing property value at line 1, character 5",
  "x k:\"xy": "invalid property value at line 1, character 5: \"\\\"xy\"",
  "(a": "line 1 must start with node or edge",
  "a b: c:d": "...",
}

describe("parsing errors", () => {
  for (const [input] of Object.entries(invalid)) {
    it(input, () => {
      assert.throws(() => parse(input)) // TODO: check error message
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
  for (const [name, space] of Object.entries(whitespace)) {
    it(name, () => {
      const id = `x${space}:y`
      const g = { nodes: [{ id, labels: [], properties: {} }], edges: [] }
      assert.deepEqual(parse(id), g)
    })
  }
})
