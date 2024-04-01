# Property Graph Exchange Format (PG)

This document describes the **Property Graph Exchange Format (PG)** with its
data model and serializations. Details are still subject of discussion, so this
is no final specification yet.

**See <https://github.com/pg-format/specification> for current work on specification.**

## PG format

PG format is a text-based serialization of property graphs.
A PG file encodes a property graph as Unicode string. The encoding can formally
be specified with the following grammar in
[EBNF](https://www.w3.org/TR/xml/#sec-notation).

*See [file pg-format.pg](./pg-format.pg) for an illustrating example!*

A parser must replace both the two-character sequence `#xD #xA` and any `#xD`
that is not followed by `#xA` to a single `#xA` line break character before
further processing. After this normalization accepted characters include all
Unicode characters, excluding the surrogate blocks, FFFE, and FFFF. Parsers
may accept additional code points by ignoring them or by replacing them with the
Unicode replacement character `#FFFD`.

~~~ebnf
CHAR	    ::= #x9 | #xA | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
~~~

An encoded graph consists of a (possibly empty) sequence of nodes, edges and
skipped lines. These elements are separated by line breaks. A final line break
is optional.

~~~ebnf
PG         ::= ( Entity | IgnorableSpace LineBreak )* IgnorableSpace
Entity     ::= ( Node | Edge ) ( SPACE* '|' SPACE* | IgnorableSpace ( LineBreak | EOF )
~~~

Skipped lines are empty or consist of spaces and/or a comment:

~~~ebnf
SPACE           ::= ( #x20 | #x9 )+
Comment         ::= '#' ( CHAR - #A )*
IgnorableSpace  ::= SPACE? COMMENT?
~~~

Whitespace is required or allowed between some parts of NODEs and EDGEs.
Whitespace can contain comments, line breaks and skipped lines only when
following line is intended by at least one space:

~~~ebnf
WS          ::= ( IgnorableSpace #A )* SPACE
~~~

A Node consists of an identifier, followed by optional labels and/or properties:

~~~ebnf
Node        ::= Identifier ( WS Label )* ( WS Property )*
~~~

An EDGE consists of an identifier, followed a direction, another identifier,
and optional labels and/or properties:

~~~ebnf
Edge        ::= Identifier Direction Identifier ( WS Label )* ( WS Property )*
Direction   ::= WS? ( '--' | '->' ) WS?
~~~

Labels start with a colon. Properties consist of a key, a colon, and one or
more comma-separated values:

~~~
Label       ::= ':' Identifier
Property    ::= Identifier ':' WS? ValueList
ValueList   ::= Value ( WS? ',' WS? Value )*
~~~

Identifiers, keys, and values can be given as string in quotation marks or in
plain form. Plain elements must not contain spaces or tabulators and must not
start with quotation mark, colon or opening parenthesis. Plain values further
must not contain colon nor comma:

~~~ebnf
Identifier  ::= String | Unquoted
Unquoted    ::= ( PlainChar - ( ':' | '(' | ',' | '#' ) ) ) PlainChar*
PlainChar   ::= CHAR - ( SPACE | '"' | '<' | '>' | '{' | '}' | '|' | '\' | '^' )
~~~

The exclusion of bracket characters is motivated by the ability to make use of
these special characters to define extensions such as queries, variables, and
templates (all beyond the scope of PG format).

Values are defined equivalent to scalar values in JSON (RFC 4627):

~~~ebnf
SCALAR      ::= STRING | NUMBER | BOOLEAN
BOOLEAN     ::= 'true' | 'false' 
NUMBER      ::= '-'? ( '0' | [1-9] [0-9]* ) ( '.' [0-9]+ )? EXPONENT?  
EXPONENT    ::= ( 'e' | 'E' ) ( '+' | '-' )? [0-9]+
STRING      ::= '"' ( UNESCAPED | ESCAPED )* '"'
UNESCAPED   ::= [#x20-#x21] | [#x23-#x58] | [#x5D-#x10FFFF]
ESCAPED     ::= '\' ( ["/\bfnrt"/\] | 'u' HEX HEX HEX HEX )
HEX         ::= [0-9] | [A-F] | [a-f]
~~~


## See also

Common graph databases with support of labeled property graphs include:

- [Neo4J](https://neo4j.com/) (limitations: edges have one mandatory label, multiple properties of same name must have same data type)
- [Memgraph](https://memgraph.com/) and [Kùzu](https://kuzudb.com) are compatible with Neo4J
- [Oracle Property Graph](https://docs.oracle.com/en/database/oracle/property-graph/index.html) (implements [PGQL](https://pgql-lang.org/): empty string labels seem to be allowed)
- [Azure Cosmos DB for Gremlin](https://learn.microsoft.com/azure/cosmos-db/gremlin/) (limitations: edges have one mandatory label...) and other databases supporting [Apache TinkerPop](https://tinkerpop.apache.org/)
- [ArangoDB](https://arangodb.com/)
- ...

Alternative property graph serialization formats, all more complex than PG, include:

- [YARS-PG](https://github.com/lszeremeta/yarspg) and
- [GDL](https://github.com/s1ck/gdl)
- [gram](https://github.com/gram-data/gram-js)

The [Neo4J APOC import/export JSON format](https://neo4j.com/labs/apoc/4.1/export/json/) is similar to PG-NJSON. It differs in the following aspects:

- there is an additional key `type` with value `node` or `edge`
- edge labels are strings instead of array of strings each edge has exactely one label
- property values are scalar instead of array of scalars if there is only one property value
- property values can also be extended types serialized as JSON object
- key `property` is omitted in nodes and edges without properties
- edge keys are named `start` and `end` instead of `from` and `to` and they hold a JSON object with node `id` and `labels` instead of the plain identifier

Many more graph formats exist (
[GraphSON](https://tinkerpop.apache.org/docs/3.7.1/dev/io/#graphson),
[JGF](http://jsongraphformat.info/),
[GraphML](http://graphml.graphdrawing.org/),
[dot](https://graphviz.org/doc/info/lang.html),
[GML](https://en.wikipedia.org/wiki/Graph_Modelling_Language)...)
some of which might also be able to serialize property graphs.

See also Tomaszuk et al. (2019) <https://doi.org/10.1007/978-3-030-19093-4_27> for a summary of property graph serializations.

