// Simple implementation without grammar and support of edge cases

// remove double quotes
const parseId = s => /^".*"$/.test(s) ? JSON.parse(s) : s

const SPACE = /( |\t)+/             // differs from /\s+/
const SKIPPED = /^\s*(#.*)?$/
const STRING = /"(\\\\|\\"|[^"])*"/
const DIRECTION = /(--|->|<-)/
const PLAIN = new RegExp("[^\" \\t:]+([^\" \\t]+[^\" \\t:]+)?")
const ID = new RegExp(`(${STRING.source}|${PLAIN.source})`)
const NODE = new RegExp(`^${ID.source}`)
const EDGE = new RegExp(`^${ID.source}${SPACE.source}${DIRECTION.source}${SPACE.source}${ID.source}`)
const LABEL = new RegExp(`${SPACE.source}:${ID.source}`, "g")
const SCALAR = new RegExp(`^(${STRING.source}|true|false|null|-?[0-9]+(\\.[0-9]+)?)`)
const NOCOLON = new RegExp("^[^\": \\t]+")

const extractItem = function (line) {
  let id1, id2, undirected, match, index = 0
  
  if ((match = EDGE.exec(line))) {          // EDGE
    if (match[5] === "<-") {
      id2 = parseId(match[1])
      id1 = parseId(match[7])
    } else {
      id1 = parseId(match[1])
      id2 = parseId(match[7])
      if (match[5] === "--") {
        undirected = true
      }
    }
  } else if ((match = NODE.exec(line))) {   // NODE
    id1 = parseId(match[1])
  } else {
    throw new Error(`Expecting node nor edge, got ${JSON.stringify(line)}`)
  }
  index = match[0].length

  const labels = new Set()                  // LABELS
  while ((match = LABEL.exec(line))) {
    labels.add(parseId(match[2]))
    index = match.index + match[0].length
  }

  const properties = new Map()              // PROPERTIES
  while ((match = /^[ \t]+/.exec(line.substr(index)))) {
    index += match[0].length
    if (index === line.length) {
      break
    }

    let rest = line.substr(index)
    let key, value, spaced = false

    const SPACED_KEY = new RegExp(`^(${ID.source}):${SPACE.source}`)
    const KEY = new RegExp(`^([^": \\t]+|${STRING.source}):`)
    const PLAIN_VALUE = new RegExp(`^(${PLAIN.source})`) // allowed only after space

    if ((match = SPACED_KEY.exec(rest))) {
      key = parseId(match[1])
      spaced = true
    } else if ((match = KEY.exec(rest))) {
      key = parseId(match[1])
    } else {
      throw new Error(`Invalid property key: ${JSON.stringify(rest)}`)
    }
    index += match[0].length
    rest = line.substr(index)
      
    if (( match = SCALAR.exec(rest))) { // allowed with and without space
      value = JSON.parse(match[0])
    } else if ( (spaced && (match = PLAIN_VALUE.exec(rest))) || ( match = NOCOLON.exec(rest) )) {
      value = match[0]
    } else {
      throw new Error(`Invalid or missing property value: ${JSON.stringify(rest)}`)
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
    throw new Error(`Invalid content after element: ${JSON.stringify(line.substr(index))}`)
  }

  return [id1, id2, undirected, Array.from(labels), properties]
}

export const parse = (pgstring) => {
  const nodes = {}, edges = []

  // TODO: include line numbers in errors
  const lines = pgstring.split(/[\r\n]+/)
    .filter(line => !SKIPPED.test(line))
    .reduce(
      (list, line) => {
        if (/^\s+/.test(line)) {
          if (list.length === 0) {
            throw new Error("Line must not start with spaces")
          }
          list[list.length - 1] += line
        } else {
          list.push(line)
        }
        return list
      },
      [])

  lines.forEach(line => { 

    let [id, id2, undirected, labels, props] = extractItem(line)

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

  return {
    nodes: Object.keys(nodes).sort().map(id => nodes[id]),
    edges,
  }
}

