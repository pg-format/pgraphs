import { ParsingError } from "../error.js"
import { graph } from "../utils.js"

// remove double quotes
const parseId = s => /^".*"$/.test(s) ? JSON.parse(s) : s

const SKIPPED = /^\s*(#.*)?$/   // empty line with optional comment
const SPACE = /[ \t\n]+/  // newline is introduced for folded lines to end comments
const COMMENT = /#[^\n]*(\n[ \t\n]*)?/  // including appended folded line space

const WS = new RegExp(`${SPACE.source}(${COMMENT.source})?`)
const LTRIM = /^[ \t\n]+(#[^\n]*(\n[ \t\n]*)?)?/
const STRING = /"(\\\\|\\"|[^"])*"/
const DIRECTION = /(--|->|<-)/
const PLAIN = new RegExp("[^\" \\t\\n:(]([^\" \\t\\n]*[^\" \\t\\n:)])?")
const ID = new RegExp(`(${STRING.source}|${PLAIN.source})`)
const NODE = new RegExp(`^${ID.source}`)
const EDGE = new RegExp(`^${ID.source}${WS.source}${DIRECTION.source}${WS.source}${ID.source}`)
const LABEL = new RegExp(`^${WS.source}:${ID.source}`)
const SCALAR = new RegExp(`^(${STRING.source}|true|false|null|-?[0-9]+(\\.[0-9]+)?)([eE][+-]?[0-9]+)?`)
const ALLOWED = new RegExp("^[^\": \\t()]+")

const extractItem = function (line, lnum) {
  let id1, id2, undirected, match, index = 0
  
  if ((match = EDGE.exec(line))) {          // EDGE
    if (match[6] === "<-") {
      id2 = parseId(match[1])
      id1 = parseId(match[9])
    } else {
      id1 = parseId(match[1])
      id2 = parseId(match[9])
      if (match[6] === "--") {
        undirected = true
      }
    }
  } else if ((match = NODE.exec(line))) {   // NODE
    id1 = parseId(match[1])
  } else {
    if (line[0] === ":") { 
      throw new ParsingError("node identifier must not start with colon at LINE", lnum)
    } else {
      throw new ParsingError("LINE must start with node or edge", lnum)
    }
  }
  index = match[0].length

  const labels = new Set()                  // LABELS
  while ((match = LABEL.exec(line.substr(index)))) {      
    labels.add(parseId(match[3]))
    index += match[0].length
  }

  const properties = new Map()              // PROPERTIES
  while ((match = LTRIM.exec(line.substr(index)))) {
    index += match[0].length
    if (index === line.length) {
      break
    }

    let rest = line.substr(index)
    let key, value, spaced = false

    const WSD_KEY = new RegExp(`^(${ID.source}):${WS.source}`)
    const KEY = new RegExp(`^([^": \\t]+|${STRING.source}):`)
    const PLAIN_VALUE = new RegExp(`^(${PLAIN.source})`) // allowed only after space

    if ((match = WSD_KEY.exec(rest))) {
      key = parseId(match[1])
      spaced = true
    } else if ((match = KEY.exec(rest))) {
      key = parseId(match[1])
    } else {
      const msg = `invalid ${properties.size ? "" : "label or "}property key at LINE, POS is CHAR`
      throw new ParsingError(msg, lnum, index, line)
    }
    index += match[0].length
    rest = line.substr(index)
      
    if (rest == "") {
      throw new ParsingError("missing property value at LINE, POS", lnum, index)
    }

    if (( match = SCALAR.exec(rest))) { // allowed with and without space
      value = JSON.parse(match[0])
    } else if ( (spaced && (match = PLAIN_VALUE.exec(rest))) || ( match = ALLOWED.exec(rest) )) {
      value = match[0]
    } else {
      throw new ParsingError("invalid property value at LINE, POS: TEXT", lnum, index, line)
    }
    index += match[0].length

    // add property
    if (properties.has(key)) {
      properties.get(key).add(value)
    } else {
      properties.set(key, new Set([value]))
    } 
  }

  if (index != line.length) {
    if (labels.size == 0 && properties.size == 0) {
      throw new ParsingError("invalid node identifier at LINE POS is CHAR", lnum, index, line)
    } else {
      throw new ParsingError("invalid content at LINE, POS: TEXT", lnum, index, line)
    }
  }

  return [id1, id2, undirected, Array.from(labels), properties]
}

export default (pgstring) => {
  const nodes = {}, edges = []

  const lines = []
  pgstring.split(/\r\n|\n|\r/).forEach((line, index) => {
    if (!SKIPPED.test(line)) {
      if (/^\s+/.test(line)) {
        if (lines.length === 0) {
          throw new ParsingError("LINE must not start with whitespace", index+1)
        }
        // FIXME: comment at line end
        lines[lines.length - 1].line += "\n" + line
      } else {
        lines.push({ line, index: index+1 })
      }
    }
  })

  lines.forEach(({ line, index }) => { 
    let [id, id2, undirected, labels, props] = extractItem(line, index)

    const properties = {}
    for (let [key, values] of props) {
      properties[key] = Array.from(values)
    }

    if (id2 == null) {
      nodes[id] = { id, labels, properties }
    } else {
      const edge = { from: id, to: id2, labels, properties } 
      if (undirected) {
        edge.undirected = true
      }
      edges.push(edge)
      if (!(id in nodes)) {
        nodes[id] = { id, labels: [], properties: {} }
      }
      if (!(id2 in nodes)) {
        nodes[id2] = { id: id2, labels: [], properties: {} }
      }
    }
  })

  return graph(nodes, edges)
}
