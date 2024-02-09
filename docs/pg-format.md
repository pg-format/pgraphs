# Property Graph Exchange Format (PG)

This document describes the **Property Graph Exchange Format (PG)** with its
data model and serializations. Details are still subject of discussion, so this
is no final specification yet.

## Introduction

**Property Graphs** (also known as **Labeled Property Graphs**) are used as
abstract data structure in graph databases and related applications. 

A property graph consists of **nodes** and **edges** between these nodes. Each
edge can be directed or undirected.  Each of the nodes and edges can have a set
of zero or more **labels** and a set of and zero or more properties.
**properties** are key-value pairs where the same key may have multiple values.
**values** are Unicode strings or scalar values of other data types.

Implementations of property graphs slightly differ in support of data types,
restrictions on labels etc. The property graph model PG is aimed to be a
superset of property graph models of common graph databases. The model and its
serializations [PG format](#pg-format) and [PG-JSON](#pg-json) have first been
proposed by Hirokazu Chiba, Ryota Yamanaka, and Shota Matsumoto
([2019](https://arxiv.org/abs/1907.03936), [2022](https://arxiv.org/abs/2203.06393)).

## PG format

PG format is a text-based serialization of [property graphs](#property-graphs).
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

~~~
Char	    ::= #x9 | #xA | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
~~~

An encoded graph consists of a (possibly empty) sequence of nodes, edges and
skipped lines. These elements are separated by line breaks. A final line break
is optional.

~~~
pg          ::= ( element Space? ( #xA element Space? )* )? #A?
element     ::= node | edge | skipped
~~~

Skipped lines are empty or consist of spaces and/or a comment:

~~~
skipped     ::= ( #x20 | #x9 )* Comment?
Comment     ::= '#' ( Char - #A )*
~~~

Whitespace is required or allowed between some parts of nodes and edges.
Whitespace can contain comments, line breaks and skipped lines only when
following line is intended by at least one space:

~~~
WS          ::= ( Space | folding )+ ( Space | Comment | folding )*
folding     ::= ( #A skipped )* #A Space+ )+
Space       ::= ( #x20 | #x9 )+
~~~

A node consists of an identifier, followed by optional labels and/or properties:

~~~
node        ::= id ( WS label )* ( WS property )*
~~~

An edge consists of an identifier, followed a direction, another identifier,
and optional labels and/or properties:

~~~
edge        ::= id WS? direction WS? id ( WS label )* ( WS property )*
direction   ::= '--' | '->' | '<-'
label       ::= ':' id
property    ::= ( id ':' WS ( scalar | plain ) )
              | ( nocolon+ |  string ) ':' WS? ( scalar | nocolon+ )
~~~

Identifiers, labels, and property names can be given as string or in plain form (that is not including space or quotation mark and not not starting or ending with a colon):

~~~
id          ::= string | plain
plain       ::= nocolon ( ( Char - ( Space | '"' ) )+ nocolon )?
nocolon     ::= ( Char - ( Space | '"' | ':' ) )+
~~~

Values are defined equivalent to scalar values in JSON (RFC 4627):

~~~
scalar      ::= Boolean | Null | number | string
Boolean     ::= 'true' | 'false' 
Null        ::= 'null'
number      ::= '-'? ( Digit - '0' ) Digit* ( '.' Digit+ )? 
Digit       ::= '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
string      ::= '"' ( unescaped | escaped )* '"'
unescaped   ::= #x20-21 | #x23-58 | #x5D-#x10FFFF
escaped     ::= '\"' | '\\' | '\/' | '\b' | '\f' | '\n' | '\r' | '\t' 
              | '\u' HEX HEX HEX HEX 
HEX         ::= Digit | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' 
                      | 'a' | 'b' | 'c' | 'd' | 'e' | 'f'
~~~

## PG-JSON

**PG-JSON** is a serialization of the same property graph data model in JSON. A graph is encoded as JSON object with exactely two fields:

- `nodes` an array of nodes
- `edges` an array of edges

Each node is a JSON object with exactely three fields:

- `id` the internal node identifier, being a string. Node identifiers must be unique per graph.
- `labels` a (possibly empty) array of labels, each being a string. Labels must be unique per node.
- `properties` a (possibly empty) JSON object mapping non empty strings to non-empty arrays of scalar JSON values (string, number, boolean, or null)

Each edge is a JSON object with one optional and four mandatory fields:

- `undirected` (optional) a boolean value whether the edge is undirected
- `from` an identifier of a node in this graph
- `to` an identifier of a node in this graph
- `labels` a (possibly empty) array of labels, each being a string. Labels must be unique per edge.
- `properties` a (possibly empty) JSON object with properties with same definition as above in node objects.

The PG-JSON format is also defined by JSON Schema file
[`pg-schema.json`](../pg-schema.json) in this repository. Rules not covered
by the schema:

- node ids must be unique per graph
- nodes referenced in edges must be defined
- edges must be unique per graph

## Example

The same graph in PG format and PG-JSON format:

~~~
# NODES
101 :person  name:Alice  country:"United States"
102 :person  :student  name:Bob  country:Japan

# EDGES
101 -- 102  :same_school  :same_class  since:2012
101 -> 102  :likes  since:2015
~~~

~~~json
{
  "nodes": [{
    "id": "101", "labels": [ "person" ],
    "properties": { "name": [ "Alice" ], "country": [ "United States" ] }
   },{
    "id": "102", "labels": [ "person", "student" ],
    "properties": { "name": [ "Bob" ], "country": [ "Japan" ] }
  }],
  "edges": [{
    "from": "101", "to": "102", "undirected": true,
    "labels": [ "same_school", "same_class" ], "properties": { "since": [ 2012 ] }
   },{
    "from": "101", "to": "102",
    "labels": [ "likes" ], "properties": { "since": [ 2015 ] }
  }]
}
~~~

A more complex example illustrating PG format [can be found here](./pg-format.pg).

## See also

Common graph databases with support of labeled property graphs include:

- [Neo4J](https://neo4j.com/) (limitations: edges have one mandatory label, multiple properties of same name must have same data type)
- [Memgraph](https://memgraph.com/) is compatible with Neo4J
- [Oracle Property Graph](https://docs.oracle.com/en/database/oracle/property-graph/index.html) (implements [PGQL](https://pgql-lang.org/): empty string labels seem to be allowed)
- [Azure Cosmos DB for Gremlin](https://learn.microsoft.com/azure/cosmos-db/gremlin/) (limitations: edges have one mandatory label, no null type...) and other databases supporting [Apache TinkerPop](https://tinkerpop.apache.org/)
- [ArangoDB](https://arangodb.com/)
- ...

Alternative property graph serialization formats include

- [YARS-PG](https://github.com/lszeremeta/yarspg) and
- [GDL](https://github.com/s1ck/gdl)

Both are more complex than PG.

Many more graph formats exist (
[GraphSON](https://tinkerpop.apache.org/docs/3.7.1/dev/io/#graphson),
[JGF](http://jsongraphformat.info/),
[GraphML](http://graphml.graphdrawing.org/),
[dot](https://graphviz.org/doc/info/lang.html),
[GML](https://en.wikipedia.org/wiki/Graph_Modelling_Language)...)
some of which might also be able to serialize property graphs.


