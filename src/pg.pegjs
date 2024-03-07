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
  = ( Edge / Node ) ( Space* "|" Space* / ( Space Comment? )? ( LineBreak / End ) )

EmptyLine
  = Space? Comment? LineBreak

LineBreak "linebreak"
  = [\x0D\x0A]+

Space "space"
  = [\x20\x09]+

Comment "comment"
  = "#" [^\x0D\x0A]*

WS
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
    direction:Direction
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

Direction
  = WS @( "->" / "<-" / "--" ) WS

Label "label"
  = WS ":" Space? id:Identifier { return id }

Identifier
  = QuotedString
  / PlainIdentifier

PlainChar
  = [^\x20\x09\x0A\x0D"<>{}|^]

PlainStart
  = ![:(,#] PlainChar

PlainIdentifier
  = $( PlainStart PlainChar* )

Property "property"
  = WS name:Key value:ValueList {
      return [ name, value ]
    }

Key
  = @QuotedString Space? ":"
  / ( @PlainIdentifier Space ":" )
  / name:( $PlainStart $( ( !":" PlainChar )* ":" )+ ) {
      return name.join("").slice(0,-1)
    }

ValueList
  = values:( WS? @Value ) |1.., ( WS? "," )| {
      return values
    }

Value "value"
  = Scalar
  / UnquotedString

UnquotedString
  = $( PlainStart ( !"," PlainChar )* )

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
