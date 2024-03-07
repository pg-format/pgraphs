This page illustrates the grammar of **PG format** as railroad diagram. The diagrams have been [generated automatically](https://github.com/peggyjs/peggy-tracks) from the [reference grammar](../src/pg.pegjs) so they are guaranteed to match the implementation.

*Some details of PG formats are [still being discussed](https://github.com/pg-format/pg-formatter/discussions) so this may change!*


### Basic structure

A property graph (**PG**) is encoded in PG format in Unicode as sequence of
[**entities**](#entities). Empty lines of [spaces and
comments](#spaces-and-comments) are ignored. The graph may be empty.

![](PG.svg)

An entity is either a **node** or an **edge**. Entities are separated from each
other with a line break or vertical bar (`U+007C`). Optional space and
a comment are ignored, if following the entity on the same line.

![](Entity.svg)

**Example:** the following file contains of three nodes `a`, `b`, `c`, and `d`:

~~~pg
a

b # comment
c|d
~~~


### Entities

A **node** starts with a node [identifier](#identifiers-and-keys). An **edge**
starts with  two node identifiers connected via a direction. Both nodes and
edges can be followed by optional [labels and properties](#labels-and-properties).

![](Node.svg)

![](Edge.svg)

![](Direction.svg)


### Labels and properties

A **label** is an identifier preceded by whitespace and a colon. Space is
allowed between colon and the identifier:

![](Label.svg)

A **property** is preceded by whitespace and it consists of a key and a non-empty list of comma-separated values:

![](Property.svg)

![](ValueList.svg)

*FIXME: the ValueList diagram [is misleading](https://github.com/peggyjs/peggy-tracks/issues/27)*

**Example:** the following graph consists of two nodes `a` and `b`, both with label
`person`, and an edge from `a` to `b`. The node `a` and the edge both have
a property:

~~~pg
a :person age:42
b :person
a -> b :knows since:2020
~~~


### Identifiers and Property Keys

An **identifier** is either given as quoted string or in plain form. A plain
identifier must not contain spaces, tabs, or any of the characters `"`, `|`,
`<`, `>`, `\ `, and `^`. It further must not start with colon, comma, opening
parenthesis or hash:

![](Identifier.svg)

![](PlainIdentifier-1.svg)

A property **key** is an identifier followed by a colon:

![](Key.svg)

**Example:** The set of allowed characters supports numbers, alphanumeric
strings and URIs to be used used as unquoted identifiers:

~~~pg
1 dc:date:2024 url: http://example.org/ 
http://example.org/a -> http://example.org/b 
~~~

### Property Values

An individual **value** can be given strictly following JSON grammar (RFC 7159)
or as unquoted string. The latter is like a plain identifier but in addition it
must not contain comma:

![](Value-1.svg)

![](Number-2.svg)

![](QuotedString-4.svg)


**Example:** the following node has a property `key` with thre values `1`, `2`,
and `3`. The example also use line folding with
[whitespace](#spaces-and-comments):

~~~pg
node
  key : 1
  key : 2,3
~~~


### Spaces and Comments

Any sequence of consecutive carriage return (`U+000D`) and/or line feed
(`U+000A`) is a **line break** and any sequence of space (`U+0020`) and/or
tabular (`U+0009`) is a **space**:

![](LineBreak.svg) ![](Space.svg)

**Empty lines** can contain space and a comment. A comment starts with a hash
(`U+0023`) and it ends at the next line break or at the end of input.

![](EmptyLine.svg)

![](Comment.svg)

All elements of an entity must be separated by **Whitespace** (**WS**). This
can either be a space or a line break, if the next line starts with a space
("line folding"). Trailing space, comment and empty lines are ignored in
between: 

![](WS.svg)


