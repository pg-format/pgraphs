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

PG = ( line ( newline line )* )? newline? !.
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

line
  = entity trailingSpace? / empty

newline "newline"
  = [\x0D\x0A]+

empty
  = spaceChar* comment?

spaceChar "space"
  = [\x20\x09]

comment "comment"
  = '#' [^\x0D\x0A]*

trailingSpace
  = spaceChar+ comment?

whiteSpace
  = ( trailingSpace / spaceChar* ) folding / spaceChar+

folding
  = newline ( empty newline )* spaceChar+

entity "identifier"
  = id:identifier
    edge:(whiteSpace direction:direction whiteSpace to:identifier { return { direction, to } })?
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

edge
  = from:identifier
    whiteSpace
    direction:direction
    whiteSpace
    to:identifier
    labels:label*
    props:property* {
      const edge = { from, to, labels, properties: collectProps(props) }
      if (direction === '<-') {
        edge.from = to
        edge.to = from
      } else if (direction === '--') {
        edge.undirected = true
      }
      edges.push(edge)
    }

direction "->, <-, --"
  = '->' / '<-' / '--'

label "label"
  = whiteSpace ':' id:identifier { return id }

identifier
  = string
  / plainIdentifier

// must not start with hash, colon, opening parenthesis, comma
plainIdentifier
  = $( nameStart idChar* )

nameStart
  = [^\x20\x09\x0A\x0D":(,#] 

property "property"
  = whiteSpace name:name whiteSpace? value:values {
      return [ name, value ]
    }

idChar
  = [^\x20\x09\x0A\x0D"]

nameChar
  = [^\x20\x09\x0A\x0D:"]

name
  = @string ':'
  / plainName

// must not start with hash, colon, opening parenthesis, comma
// must not contain quotation mark 
// must end with colon
plainName
  = name:( nameStart $( nameChar* ':')+ ) {
      return name.join("").slice(0,-1)
    }

values
  = values:value|1.., delimiter| {
      return values
    }

delimiter
 = whiteSpace? "," whiteSpace?

value "value"
  = scalar
  / plainValue

plainValue
  = $( [^\x20\x09\x0A\x0D":(,:] [^\x20\x09\x0A\x0D,:]* )

// Scalar value as defined in JSON (RFC 7159).
// Grammar taken and adjusted from peggy example 'json.pegjs'.

scalar
  = string
  / number
  / true
  / false
  / null

string
  = '"' chars:char* '"' { return chars.join("") }

char
  = unescaped
  / escape
    sequence:(
        '"'
      / "\\"
      / "/"
      / "b" { return "\b" }
      / "f" { return "\f" }
      / "n" { return "\n" }
      / "r" { return "\r" }
      / "t" { return "\t" }
      / "u" digits:$(hex hex hex hex) {
          return String.fromCharCode(parseInt(digits, 16));
        }
    )
    { return sequence }

escape
  = "\\"

unescaped
  = [^\0-\x1F\x22\x5C]

true  = "true"  { return true  }
false = "false" { return false }
null  = "null"  { return null  }

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
