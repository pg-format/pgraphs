{{
  function collectProps(props) {
    const properties = {}
    for (let [key, values] of props) {
      if (key in properties) {
        for (let val of values) properties[key].add(val)
      } else {
        properties[key] = new Set(values)
      }
    }
    for (let key in properties) {
      properties[key] = [...properties[key].values()]
    }
    return properties
  }
}}

{
  const nodes = {}
  const edges = []
}

PG = ( line ( linebreak line )* )? end
{
  for (let { from, to } of edges) {
    if (!(from in nodes)) nodes[from] = { id: from, labels: [], properties: {} }
    if (!(to in nodes)) nodes[to] = { id: to, labels: [], properties: {} }
  }
  return {
    nodes: Object.keys(nodes).sort().map(id => nodes[id]),
    edges 
  }
}

end
  = !.

line
  = entity trailingSpace? / empty

trailingSpace
  = space+ comment?

linebreak "linebreak"
  = [\x0D\x0A]+

empty
  = space* comment?

space "space"
  = [\x20\x09]

comment "comment"
  = '#' [^\x0D\x0A]*

whiteSpace
  = ( trailingSpace / space* ) folding / space+

folding
  = linebreak ( empty linebreak )* space+

entity "identifier"
  = id:identifier
    edge:(direction:direction to:identifier { return { direction, to } })?
    labels:label*
    props:property* {

    labels = Array.from(new Set(labels)) // remove duplicates

    if (edge) {
      var from = id
      var { direction, to } = edge
      const e = { from, to, labels, properties: collectProps(props) }
      if (direction === '<-') {
        e.from = to
        e.to = from
      } else if (direction === '--') {
        e.undirected = true
      }
      edges.push(e)
    } else {
      nodes[id] = { id, labels, properties: collectProps(props) }
    }
}

direction "->, <-, --"
  = whiteSpace dir:('->' / '<-' / '--') whiteSpace { return dir }

label "label"
  = whiteSpace ':' id:identifier { return id }

identifier
  = quotedString
  / plainIdentifier

// must not start with hash, colon, opening parenthesis, comma
plainIdentifier
  = $( nameStart idChar* )

nameStart
  = [^\x20\x09\x0A\x0D":(,#] 

property "property"
  = whiteSpace name:key value:values {
      return [ name, value ]
    }

idChar
  = [^\x20\x09\x0A\x0D"]

nameChar
  = [^\x20\x09\x0A\x0D:"]

key
  = @quotedString ':'
  / name:( nameStart $( nameChar* ':')+ ) {
      return name.join("").slice(0,-1)
    }

values
  = values:(whiteSpace? @value) |1.., (whiteSpace ",")| {
      return values
    }


value "value"
  = scalar
  / plainValue

plainValue
  = $( [^\x20\x09\x0A\x0D":(,:] [^\x20\x09\x0A\x0D,:]* )

// Scalar value as defined in JSON (RFC 7159).
// Grammar taken and adjusted from peggy example 'json.pegjs'.

scalar
  = quotedString
  / number
  / "true" { return true }
  / "false" { return false }
  / "null" { return null }

quotedString
  = '"' chars:char* '"' { return chars.join("") }

char
  = unescaped
  / escaped

escaped
  = "\\"
    sequence:(
        '"'
      / "\\"
      / "/"
      / "b" { return "\b" }
      / "f" { return "\f" }
      / "n" { return "\n" }
      / "r" { return "\r" }
      / "t" { return "\t" }
      / "u" @codepoint )
    { return sequence }

codepoint
  = digits:$(hex |4|) {
          return String.fromCharCode(parseInt(digits, 16));
        }

unescaped
  = [^\0-\x1F\x22\x5C]

number
  = "-"? int frac? exp? { 
      return parseFloat(text())
    }

int
  = "0" / ([1-9] [0-9]*)

frac
  = "." [0-9]+

exp
  = [eE] [+-]? [0-9]+

hex = [0-9a-f]i
