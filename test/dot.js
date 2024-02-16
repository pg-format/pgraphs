import { assert } from "chai"
import { readFile } from "./utils.js"
import { pgformat } from "../index.js"

const { parse } = pgformat.dot

describe("dot", () => {
  const dot = readFile("../examples/example.dot")
  it("parse", () => {
    assert.ok(parse(dot))
  })
})
