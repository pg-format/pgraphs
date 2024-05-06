{{
  import { graph, addProperties, uniq } from "../../utils.js"
}}

{
  const nodes = {}
  const edges = []
  const edgeIds = new Set()
  var backticks
}

PG = ( Entity TrailingSpace? EntitySeparator / TrailingSpace LineBreak )* TrailingSpace
{
  return graph(nodes, edges)
}

End
  = !.

EntitySeparator
  = ( "|" Space? / LineBreak / End )

Entity
  = ( Edge / Node ) 

TrailingSpace
  = Space? Comment?

LineBreak "linebreak"
  = [\x0D\x0A]+

Space "space"
  = [\x20\x09]+

Comment "comment"
  = "#" [^\x0D\x0A]*

WS
  = ( TrailingSpace LineBreak )* Space

Node
  = id:Identifier labels:Label* props:Property* {
      if (id in nodes) {
        nodes[id].labels = uniq([...nodes[id].labels, ...labels])
        nodes[id].properties = addProperties(props, nodes[id].properties)
      } else {
        nodes[id] = { id, labels: uniq(labels), properties: addProperties(props) }
      }
  }

EdgeIdentifier
 = ( @QuotedIdentifier ":" WS )
  / ( @UnquotedIdentifier ":" WS )
  / UnquotedIdentifierFollowedByColonAndSpace

Edge
  = id:( EdgeIdentifier? )
    from:( Identifier? ) 
    direction:Direction 
    to:Identifier
    labels:Label*
    props:Property* {
    if (!id && !from) { expected("identifier") }
    if (!from) { from = id; id=null }

    const edge = { from, to, labels: uniq(labels), properties: addProperties(props) }
    if (direction === "--") { edge.undirected = true }
    if (id) {
      if (edgeIds.has(id)) {
        error(`Repeated edge identifier "${id}"`)
      }
      edge.id = id
      edgeIds.add(id)
    }
    edges.push(edge)
 }

Direction
  = WS @( "->" / "--" ) WS

Label "label"
  = WS ":" Space? id:Identifier { return id }

Identifier
  = QuotedIdentifier
  / UnquotedIdentifier

QuotedIdentifier
  = id:QuotedString { 
      if (id === "") { error("Identifier must not be empty") }
      return id
    }
    / VerbatimString

PlainChar
  = [^\x20\x09\x0A\x0D<>"{}|^`\\]

PlainStart
  = ![:([#-] PlainChar

UnquotedIdentifier
  = $( PlainStart PlainChar* )

UnquotedIdentifierFollowedByColonAndSpace
 = @( PlainStart ( ( !":" PlainChar )* ":" )+ { return text().slice(0,-1) } ) WS

Property "property"
  = WS name:Key value:ValueList { return [ name, value ] }

Key
  = ( @QuotedIdentifier Space? ":" )
  / ( @UnquotedIdentifier Space ":" )
  / UnquotedIdentifierFollowedByColonAndSpace
  / @UnquotedIdentifierWithoutColon ":"

UnquotedIdentifierWithoutColon
  = $( PlainStart ( !":" PlainChar )* )

ValueList
  = first:( WS? @Value ) rest:( WS? "," WS? @Value )* {
      return [first, ...rest]
    }

Value "value"
  = Scalar
  / UnquotedString

UnquotedString
  = $( PlainStart ( !"," PlainChar )* )

// Scalar value as defined in JSON (RFC 7159) except null.
// Grammar taken and adjusted from peggy example 'json.pegjs'.

Scalar
  = QuotedString
  / Number { return parseFloat(text()) }
  / "true" { return true }
  / "false" { return false }

QuotedString
  = '"' chars:( Char / "'" )* '"' { return chars.join("") }
  / "'" chars:( Char / '"' )* "'" { return chars.join("") }

VerbatimString
  = ( "`"+ { backticks = text().length } ) 
    ( [^`]+ "`"|0..{ return backticks-1 }| )+
    ( [^`]* "`" / "`"|{ return backticks }| )
    {
        var str = text().slice(backticks,-backticks)
        if (str.match(/^ .+ $/)) {
          str = str.slice(1,-1)
        } else {
          str = str.replace(/^(\n|\r\n?)(.+)(\n|\r\n?)$/,"$2")
        }
        return str
    } 

Char
  = Unescaped
  / Escaped

// Excludes quotes, backslash, and control codes but includes \t, \n, \r
Unescaped
  = [^\x00-\x08\x0B\x0C\x0E-\x1F"'\\] 

Escaped
  = "\\"
    sequence:(
        '"'
      / "'"
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
