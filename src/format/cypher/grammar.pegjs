// Parse subset of Cypher, based on the official OpenCypher grammar
// and checked by testing edge cases with Neo4J

{{
  import { graph, addProperties, randomId } from "../../utils.js"
  const isEmpty = ({labels,properties}) => !labels.length && !Object.keys(properties).length
}}

{
  const nodes = {}
  const edges = []
}

Create
  = ( SP? "CREATE"i SP? Pattern SP? )* EOF {
      return graph(nodes, edges)
    }

Pattern
  = PatternElement |1.., ( SP? "," SP? )|

PatternElement
  = ( n:NodePattern edgeList:( SP? @PatternElementChain )* {
      const addNode = node => {
        if (!(node.id in nodes) || isEmpty(nodes[node.id])) {
          nodes[node.id] = node
        } else if (!isEmpty(node)) {
          error(`Can't create already declared node \`${node.id}\` with labels or properties`)
        }
      } 
      if ( edgeList.length ) {
        var from = n
        addNode(from)
        edgeList.forEach(({to, reverse, ...edge}) => {
          if (reverse) {
            edge.from = to.id
            edge.to = from.id
          } else {
            edge.from = from.id
            edge.to = to.id
          }
          addNode(to)
          edges.push(edge)
          from = to
        })
      } else if (n.id in nodes) {
        error(`Node \`${n.id}\` already declared`)
      } else {
        nodes[n.id] = n
      }
    } )
  / ( "(" PatternElement ")" )

NodePattern
  = "(" SP? id:( ( @Name SP? )? ) labels:Label* props:Properties? ")" { 
      id ??= randomId()
      // labels must be unique
      labels = Array.from(new Set(labels))
      return { id, labels, properties: addProperties(props || []) }
    }

Label "type"
  = ":" SP? @Name SP?

PatternElementChain
  = edge:RelationshipPattern SP? to:NodePattern {
      return { ...edge, to }
    }

RelationshipPattern
  = ( Dash SP? edge:RelationshipDetail? SP? Dash SP? RightArrowHead {
      return edge
    } )
  / ( LeftArrowHead SP? Dash SP? edge:RelationshipDetail? SP? Dash {
      return { ...edge, reverse: true }
    } )

RelationshipDetail
  = "[" SP? ( Name SP? )? label:Label props:Properties? "]" {
      return { labels:[label], properties: addProperties(props || []) }
    }

Properties
  = @MapLiteral SP?

MapLiteral
  = "{" SP? props:( KeyValue |.., SP? "," SP?| )
    SP? "}" { return props }

KeyValue
  = key:Name SP? ":" SP? values:Values {
      return [key, values]
    }

ListLiteral
  = "[" SP? entries:( Scalar |.., SP? ","| ) SP? "]" {
      if (entries.indexOf(null) > -1) {
        error("Collections containing null values can not be stored in properties")
      }
      if ( (new Set(entries.map(v => typeof v)).size > 1 ) ) {
        error("Collections must have values of homogeneous type")
      }
      return entries
    }
   
Values
  = value:Scalar { return value === null ? [] : [ value ] }
  / ListLiteral
  / "(" @Values ")"

Scalar
  = StringLiteral
  / Number
  / "true"i { return true }
  / "false"i { return false }
  / "null"i { return null }
  / "(" @Scalar ")"

Number
  = "-"? Int Frac? Exp? { return parseFloat(text()) }

// TODO: support HexInteger and OctalInteger

Int
= "0"
  / ( [1-9] [0-9]* )

Frac
  = "." [0-9]+

Exp
  = [eE] [+-]? [0-9]+

StringLiteral
  = ( '"' chars:( [^"\\] / EscapedChar )* '"' { return chars.join("") } )
  / ( "'" chars:( [^'\\] / EscapedChar )* "'" { return chars.join("") } )

EscapedChar
  = "\\"
    char:(
        '"'
      / "'"
      / "\\"
      / "/"
      / "b"i { return "\b" }
      / "f"i { return "\f" }
      / "n"i { return "\n" }
      / "r"i { return "\r" }
      / "t"i { return "\t" }
      / "u" @Codepoint ) // TODO: support 8 hex digits 
    { return char }

Codepoint
  = digits:$( Hex |4| ) { return String.fromCharCode(parseInt(digits, 16)) }

Hex
  = [0-9a-f]i

Name
  = UnescapedSymbolicName
  / EscapedSymbolicName
 
UnescapedSymbolicName
  = $( IdentifierStart IdentifierPart* )

IdentifierStart
  = char:. &{ return char.match(/^(\p{ID_Start}|\p{Pc})/u) }

IdentifierPart
  = char:. &{ return char.match(/^(\p{ID_Continue}|\p{Sc})/u) }

EscapedSymbolicName
  = name:$( "`" [^`]* "`" )+ {
    return name.replaceAll("``","`").slice(1,-1)
  }

Dash = [-\u00ad\u2010\u2011\u2012\u2013\u2014\u2015\u2212\ufe58\ufe63\uff0d]

LeftArrowHead = [<\u27e8\u3008\ufe64\uff1c]

RightArrowHead  = [>\u27e9\u3009\ufe65\uff1e]

SP = Whitespace+

Whitespace "whitespace"
  = [ \v\b\t\f\r\n\u001C-\u001F\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205f\u3000]+
  / Comment

Comment "comment"
  = ( "/*" ( [^*] / "*" [^/] )* "*/" )
  / ( "//" [^\n\r]* "\r"? ( "\n" / EOF ) )

EOF = !.

