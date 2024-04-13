import { assert } from "chai"
import { pgformat } from "../index.js"
import { fromGraphology, toGraphology } from "../src/format/graphology/index.js"

// TODO: actually use Graphology object

const graphs = {
  "x :t k:v | a: x ->y": {
    options: { type: "directed", multi: true, allowSelfLoops: true },
    attributes: {},
    nodes: [ { key: "x", attributes: { k: "v" } }, { key: "y" } ],
    edges: [ { key: "a", source: "x", target: "y" } ]
  }
}

describe("graphology", () => {
  for (const [pg, expect] of Object.entries(graphs)) {
    const graph = pgformat.pg.parse(pg)
    it("toGrapology", () => {
      const got = toGraphology(graph)
      assert.deepEqual(got, expect)
    })
    it("fromGraphology", () => {
      const got = fromGraphology(expect)
      graph.nodes.forEach(n => n.labels=[])
      graph.edges.forEach(e => e.labels=[])
      assert.deepEqual(got, graph)
    })
  }
})

