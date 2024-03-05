{{
  function collectProps(props, properties={}) {
    for (let [key, values] of props) {
      if (key in properties) {
        for (let val of values) {
          properties[key].add(val)
        }
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

PG = ( EmptyLine* Entity )* EmptyLine* Space? Comment? End
{
  for (let { from, to } of edges) {
    if (!(from in nodes)) {
      nodes[from] = { id: from, labels: [], properties: {} }
    }
    if (!(to in nodes)) {
      nodes[to] = { id: to, labels: [], properties: {} }
    }
  }
  return {
    nodes: Object.keys(nodes).sort().map(id => nodes[id]),
    edges, 
  }
}

End
  = !.

Entity
  = ( Edge / Node ) ( Space Comment? )? ( LineBreak / ";" Space* / End )

EmptyLine
  = Space? Comment? LineBreak

LineBreak "linebreak"
  = [\x0D\x0A]+

Space "space"
  = [\x20\x09]+

Comment "comment"
  = "#" [^\x0D\x0A]*

WhiteSpace
  = ( Space Comment? / Space? ) LineBreak EmptyLine* Space
  / Space

Node
  = id:Identifier labels:Label* props:Property* {
      labels = Array.from(new Set(labels))
      if (id in nodes) {
        nodes[id].labels = Array.from(new Set([...nodes[id].labels, ...labels]))
        nodes[id].properties = collectProps(props, nodes[id].properties)
      } else {
        nodes[id] = { id, labels, properties: collectProps(props) }
      }
  }

Edge
  = from:Identifier
    WhiteSpace
    direction:Direction
    WhiteSpace
    to:Identifier
    labels:Label*
    props:Property* {

    labels = Array.from(new Set(labels))

    const e = { from, to, labels, properties: collectProps(props) }
    if (direction === "<-") {
      e.from = to
      e.to = from
    } else if (direction === "--") {
      e.undirected = true
    }
    edges.push(e)
 }

Direction "->, <-, --"
  = "->"
  / "<-"
  / "--"

Label "label"
  = WhiteSpace ":" Space? id:Identifier { return id }

Identifier
  = QuotedString
  / PlainIdentifier

PlainIdentifier
  = $( NameStart [^\x20\x09\x0A\x0D"]* )

NameStart
  = [^\x20\x09\x0A\x0D":(,;#] 

Property "property"
  = WhiteSpace name:Key value:ValueList {
      return [ name, value ]
    }

Key
  = @QuotedString Space? ":"
  / ( @PlainIdentifier Space ":" )
  / name:( NameStart $( [^\x20\x09\x0A\x0D:"]* ":" )+ ) {
      return name.join("").slice(0,-1)
    }

ValueList
  = values:( WhiteSpace? @Value ) |1.., ( WhiteSpace? "," )| {
      return values
    }

Value "value"
  = Scalar
  / UnquotedString

UnquotedString
  = $( NameStart [^\x20\x09\x0A\x0D",:;]* )

// Scalar value as defined in JSON (RFC 7159).
// Grammar taken and adjusted from peggy example 'json.pegjs'.

Scalar
  = QuotedString
  / Number
  / "true" { return true }
  / "false" { return false }
  / "null" { return null }

QuotedString
  = '"' chars:Char* '"' { return chars.join("") }

Char
  = Unescaped
  / Escaped

Escaped
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
      / "u" @Codepoint )
    { return sequence }

Codepoint
  = digits:$( Hex |4| ) {
      return String.fromCharCode(parseInt(digits, 16))
    }

Unescaped
  = [^\0-\x1F\x22\x5C]

Number
  = "-"? Int Frac? Exp? { return parseFloat(text()) }

Int
  = "0"
  / ( [1-9] [0-9]* )

Frac
  = "." [0-9]+

Exp
  = [eE] [+-]? [0-9]+

Hex
  = [0-9a-f]i
