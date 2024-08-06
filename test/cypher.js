import { assert } from "chai"
import cypher from "../src/format/cypher/index.js"
import cypherl from "../src/format/cypherl/index.js"
import pg from "../src/format/pg/index.js"

const valid = {
  "CREATE/* */(ä0 {})//": "ä0",
  "CREATE (a)-[:x]->(b)<-[:y]-(c)": "a -> b :x|c -> b :y",
  "CREATE (`a`),(b)": "a|b",
  "CREATE (a)-[:`e```]->(a :x)": "a :x|a -> a :\"e`\"",
  "CREATE (a :x)-[:_]->(a)": "a :x|a -> a :_",
  "CREATE (a :x),(a)-[:e]->(a)": "a :x|a -> a :e",
  "CREATE (_ {x:1,y:(2)})": "_ x:1 y:2",
  "CREATE (_ {x:[],y:null})": "_",
  "CREATE (_ {x:([(1),2]),y:false})": "_ x:1,2 y:false",
  "CREATE (` ` {t:\"\\t\"})": "\" \" t:\"\\t\"",
}

const invalid = {
  "/**/": "Expected \"CREATE\" or whitespace",
  "CREATE (a),(a)": "Node `a` already declared",
  "CREATE (a :x)-[:e]->(a :y)": "Can't create already declared node `a` with labels or properties",
  "CREATE (?)": "Expected",
  "CREATE (x {a:[null]})": "Collections containing null values can not be stored in properties",
  "CREATE (x {a:[1,true]})": "Collections must have values of homogeneous type",
}

describe("parsing valid short examples", () => {
  for (const [input, expect] of Object.entries(valid)) {
    it(input, () => assert.deepEqual(cypher.parse(input), pg.parse(expect)))
  }
})

describe("parsing errors", () => {
  for (const [input, msg] of Object.entries(invalid)) {
    it(input, () => {
      assert.throws(() => cypher.parse(input), msg)
    })
  }
})

const serialized = {
  "a :null null:false c:null b:false": "CREATE (a:null {b:false, c:\"null\", null:false})\n"
}

describe("serialization edge cases", () => {
  for (const [graph, expect] of Object.entries(serialized)) {
    const a = cypher.serialize(pg.parse(graph))
    it(expect, () => assert.equal(a, expect))
  }
})

describe("CYPHERL", () => {
  const graph = pg.parse("A :b c:1 d:2 | A -> B :foo")

  const examples = [
    [{id: "x"}, `CREATE (:b {c:1, d:2, x:"A"});
CREATE ({x:"B"});
MATCH (a {x:"A"}), (b {x:"B"}) CREATE (a)-[:foo]->(b);
`],
    [{id: "_"}, `CREATE (:b {_:"A", c:1, d:2});
CREATE ({_:"B"});
MATCH (a {_:"A"}), (b {_:"B"}) CREATE (a)-[:foo]->(b);
`],
    [{id: "_", merge: true}, 
      "MERGE (n {_:\"A\"}) SET n = {_:\"A\", c:1, d:2}, n:b;\n"+
      "MERGE (n {_:\"B\"}) SET n = {_:\"B\"};\n" +
      "MATCH (a {_:\"A\"}), (b {_:\"B\"}) MERGE (a)-[:foo]->(b);\n"
    ]
  ]

  for (const [options, expect] of examples) {
    it(expect, () => {
      assert.equal(cypherl.serialize(graph, options), expect)
    })
  }
})
