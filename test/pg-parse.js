import { assert } from "chai"
import { graph } from "./utils.js"

import pgFormat from "../src/format/pg/index.js"
const { parse } = pgFormat

// TODO: test examples/statement-separator.pg

// FIXME: move to pg-test-suite
const validGraphs = {
  "\u3007\r0": graph("0|\u3007"),                       // Plain /r is newline, numbers as unquoted identifiers
  "'\n\r\t'": graph("\n\r\t"),
  "c: -> a:b": graph("a:b|c:", [["c:", "a:b"]]),        // Id can contain and end colon
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
  "a b:c:d b:c: d": graph([{id:"a",properties:{b:["c:d"],"b:c":["d"]}}]),
  "a:0 a:0 a:0": graph([{ id:"a:0", properties:{ a:[0,0] } }]),
  "ab ->  b x:1 c:false": graph("ab|b",[{from:"ab",to:"b",properties:{x:[1],c:[false]}}]),
  "0 bc:d": graph([{id:"0",properties:{bc:["d"]}}]),
  "a -> b | a :foo; |a :bar": graph([{id:"a",labels:["foo;","bar"]},{id:"b"}],[{from:"a",to:"b"}]),
  "a b:0|c": graph([{id:"a",properties:{b:[0]}},"c"]),
  "x a:1|x a:2,3": graph([{id:"x",properties:{a:[1,2,3]}}]),
  "\"\\\"\"": graph("\""),
  "\"\\'\"": graph("'"),
  "'\\\"'": graph("\""),
  "'\\''": graph("'"),
  // edge ids
  "a: b -> c": graph("b|c",[{id:"a", from:"b",to:"c"}]),
  "a:b: b -> c": graph("b|c",[{id:"a:b", from:"b",to:"c"}]),
  "\"a\": b -> c": graph("b|c",[{id:"a", from:"b",to:"c"}]),
}

// console.log(JSON.stringify(validGraphs,null,2))

describe("parsing valid short examples", () => {
  for (const [pg, g] of Object.entries(validGraphs)) {
    it(JSON.stringify(pg), () => assert.deepEqual(parse(pg), g))
  }
})

// FIXME: not included in test suite yet:

const invalidGraph = {
  "1: a -> b\n1: a -> b": "Repeated edge identifier",
}
describe("detect syntax errors", () => {
  for (let pg in invalidGraph) {
    it(invalidGraph[pg], () => assert.throws(() => parse(pg)))
  }
})
