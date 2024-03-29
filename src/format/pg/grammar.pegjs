{{
  import { graph, addProperties } from "../../utils.js"
}}

{
  const nodes = {}
  const edges = []
}

PG = ( Entity / IgnorableSpace LineBreak )* IgnorableSpace End
{
  for (let { from, to } of edges) {
    if (!(from in nodes)) {
      nodes[from] = { id: from, labels: [], properties: {} }
    }
    if (!(to in nodes)) {
      nodes[to] = { id: to, labels: [], properties: {} }
    }
  }
  return graph(nodes, edges)
}

End
  = !.

Entity
  = ( Edge / Node ) ( Space* "|" Space* / IgnorableSpace ( LineBreak / End ) )

IgnorableSpace
  = Space? Comment?

LineBreak "linebreak"
  = [\x0D\x0A]+

Space "space"
  = [\x20\x09]+

Comment "comment"
  = "#" [^\x0D\x0A]*

WS
  = ( IgnorableSpace LineBreak )* Space

Node
  = id:Identifier labels:Label* props:Property* {
      labels = Array.from(new Set(labels))
      if (id in nodes) {
        nodes[id].labels = Array.from(new Set([...nodes[id].labels, ...labels]))
        nodes[id].properties = addProperties(props, nodes[id].properties)
      } else {
        nodes[id] = { id, labels, properties: addProperties(props) }
      }
  }

UnquotedIdFollowedByDirection
  = from:( PlainStart ( "-"? ( !"-" PlainChar ) )* { return text() } )
    direction:( "->" / "--" ) {
      return { from, direction }
    }

Edge
  = start:(
     UnquotedIdFollowedByDirection
     / ( from:Identifier direction:Direction { return { from, direction } } )
    )
    to:Identifier
    labels:Label*
    props:Property* {
    const { from, direction } = start
    labels = Array.from(new Set(labels))
    const e = { from, to, labels, properties: addProperties(props) }
    if (direction === "--") {
      e.undirected = true
    }
    edges.push(e)
 }

Direction
  = WS? @( "->" / "--" ) WS?

Label "label"
  = WS ":" Space? id:Identifier { return id }

Identifier
  = id:QuotedString { 
      if (id === "") { error("Identifiers cannot be empty") }
      return id
    }
  / UnquotedIdentifier

PlainChar
  = [^\x20\x09\x0A\x0D"<>{}|^]

PlainStart
  = ![:(#-] PlainChar

UnquotedIdentifier
  = PlainStart PlainChar* {
      if (text().match(/--/)) { error("Unquoted identifier must not contain --") }
      return text()
    }

Property "property"
  = WS name:Key value:ValueList { return [ name, value ] }

Key
  = @( key:QuotedString Space? ":" {
        if (key === "") { error("Property keys cannot be empty") }
        return key
      } )
  / ( @UnquotedIdentifier Space ":" )
  / name:( $PlainStart $( ( !":" PlainChar )* ":" )+ ) WS {
      return name.join("").slice(0,-1)
    }
  / name:( $PlainStart $( !":" PlainChar )* ) ":" {
      return name.join("")
    }

ValueList
  = first:( WS? @Value ) rest:( WS? "," WS? @Value )* {
      return [first, ...rest]
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
  / Number { return parseFloat(text()) }
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
  = "-"? Int Frac? Exp?

Int
  = "0"
  / ( [1-9] [0-9]* )

Frac
  = "." [0-9]+

Exp
  = [eE] [+-]? [0-9]+

Hex
  = [0-9a-f]i
