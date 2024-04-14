import { assert } from "chai"
import fs from "fs"
import { localPath, readFile, graph } from "./utils.js"

import pgFormat from "../src/format/pg/index.js"
const { parse } = pgFormat

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

const valid = {
  "": graph(),
  "#": graph(),
  " #": graph(),
  " ": graph(),
  "\u3007\r0": graph("0|\u3007"),                       // Plain /r is newline, numbers as unquoted identifiers
  "a,b": graph("a,b"),
  // FIXME:
  // "c: -> a:b": graph("a:b|c:", [["c:", "a:b"]]),        // Id can contain and end colon
  "a(:# -> 本-²": graph("a(:#|本-²", [["a(:#", "本-²"]]),     // Id can contain special characters
  "x\nxy\r\nxyz # comment\n\"X\"": graph("X|x|xy|xyz"), // Node ids
  // labels and line folding
  "n1 \n  :label:x  :y #comment\n\t :a :a": graph([{ id:"n1", labels:["label:x", "y", "a"] }]),
  "a : x b:1": graph([{ id:"a", labels: ["x"], properties:{ b:1 } }]),
  // Properties
  "x a:0 ab:false a:b:c a:b:4 \"(\":5 \"-\":6": graph([{ id:"x",
    properties:{ ab:false, a:[0,"b:c", "b:4"], "(":5, "-":6 } }]),
  // Values
  "a -> b a:\"\",2\t, -2e2,null ,\n xyz a: # comment\n b:c": graph(
    "a|b",
    [{ from: "a", to: "b", labels: [], properties: { a: ["", 2, -200, "null", "xyz", "b:c"] } }],
  ),
  "a b:c:d b:c :d": graph([{id:"a",properties:{b:["c:d"],"b:c":["d"]}}]),
  "a:0 a:0 a:0": graph([{ id:"a:0", properties:{ a:[0,0] } }]),
  "ab ->  b x:1 c:false": graph("ab|b",[{from:"ab",to:"b",properties:{x:[1],c:[false]}}]),
  "0 bc:d": graph([{id:"0",properties:{bc:["d"]}}]),
  "a -> b | a :foo; |a :bar": graph([{id:"a",labels:["foo;","bar"]},{id:"b"}],[{from:"a",to:"b"}]),
  "a b:0|c": graph([{id:"a",properties:{b:[0]}},"c"]),
  "x a:1|x a:2,3": graph([{id:"x",properties:{a:[1,2,3]}}]),
  "a ->b": graph("a|b", [["a","b"]]),
  "a-\na--b": graph("a-|a--b"),
  "\"\\\"\"": graph("\""),
  "\"\\'\"": graph("'"),
  "'\\\"'": graph("\""),
  "'\\''": graph("'"),
  // edge ids
  "a: b -> c": graph("b|c",[{id:"a", from:"b",to:"c"}]),
  "a:b: b -> c": graph("b|c",[{id:"a:b", from:"b",to:"c"}]),
  "\"a\": b -> c": graph("b|c",[{id:"a", from:"b",to:"c"}]),
}

describe("parsing valid short examples", () => {
  for (const [pg, g] of Object.entries(valid)) {
    it("is valid", () => assert.deepEqual(parse(pg), g))
  }
})

const invalid = {
  "|": "",
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
  "\"\"": "Identifiers cannot be empty",
  "x :\"\"": "Identifiers cannot be empty",
  "x \"\":1": "Property keys cannot be empty",
  "\"x\\xy\"": "Invalid string escape sequence",
  "-> x": "Expected identifier",
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
