import { assert } from "chai"
import fs from "fs"
import { localPath, readFile } from "./utils.js"
import Ajv from "ajv"

const ajv = new Ajv()
const schema = JSON.parse(readFile("../schema.json"))
const validate = ajv.compile(schema)

describe("valid PG-JSON", () => {
  fs.readdirSync(localPath("../examples")).forEach(file => {
    if (file.match(/\.json$/)) {
      it(file, () => {
        const graph = JSON.parse(readFile(`../examples/${file}`))
        if (!validate(graph)) {
          console.log(validate.errors)
        }
        assert.ok(validate(graph))
      }) 
    }
  })
})
 
const node = id => ({ id, labels:[], properties: {} })

const invalid = [
  // missing or additional fields
  {},
  {nodes:[],edges:[],X:1},
  {nodes:[{}],edges:[]},
  {nodes:[],edges:[{}]},
  {nodes:[{...node("x"),X:1}],edges:[]},
  {nodes:[node("x"),node("y")],edges:[{from:"x",to:"y",labels:[],properties:{},X:1}]},
  // empty string id, label, property key
  {nodes:[{id:"",labels:[],properties:{}}],edges:[]},
  {nodes:[{id:"x",labels:[""],properties:{}}],edges:[]},
  {nodes:[{id:"x",labels:[],properties:{"":[1]}}],edges:[]},
]

describe("invalid PG-JSON", () => {
  for(let i=0; i<invalid.length; i++) {
    it(""+i, () => {
      assert.ok(!validate(invalid[i]))
    })
  }
})
