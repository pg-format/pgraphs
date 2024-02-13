import { assert } from "chai"
import { readFile } from "./utils.js"
import { pgformat } from "../index.js"

const { parse, serialize } = pgformat.dot

describe("dot", () => {
  const graph = JSON.parse(readFile("../examples/example.json"))
  const dot = readFile("../examples/example.dot")

  it("serialize", () => {
    assert.equal(serialize(graph), dot)
  })

  it("parse", () => {
    assert.ok(parse(dot))
  })
})
