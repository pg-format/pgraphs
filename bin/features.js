#!/usr/bin/env node

import Ajv from "ajv"
import fs from "fs"
import { pgformat } from "../src/formats.js" 

const schema = JSON.parse(fs.readFileSync("./schema/features.json"))
const keys = Object.keys(schema.properties)
const validate = (new Ajv()).compile(schema)
const pg = pgformat.pg.serialize

var csv = keys.join(",") + "\n"

const nodes = [], edges = []

for (let id in pgformat) {
  // eslint-disable-next-line
  const { parse, serialize, ...format } = pgformat[id]
  for (let key of Object.keys(format)) {
    if (typeof format[key] == "object") {
      delete format[key]
    }
  }
  const features = { id, ...format}
  const valid = validate(features)
  if (!valid) {
    console.error(`${id}: `+JSON.stringify(validate.errors[0])) 
  }

  const properties = Object.fromEntries(Object.entries(format).map(([key,value])=>[key,[value]]))
  nodes.push({ id, labels: ["format"], properties })

  csv += keys.map(key => features[key] ?? "").join(",") + "\n"
}

fs.writeFileSync("docs/features.csv",csv.replaceAll("false","-").replaceAll("true","✓"))
fs.writeFileSync("docs/features.pg",pg({ nodes, edges }))
