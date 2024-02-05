# pgraph

> Property Graph Exchange Format parser and serializer

This package implements parser and serializer of PG format for (labeled) property graphs. 

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [License](#license)

## Background

Property Graphs (also known as Labeled Property Graphs) are used as abstract
data structure in Graph databases and related applications. This package
implements the Property Graph Exchange Format (PG).

Alternative property graph serialization formats include
[YARS-PG](https://github.com/lszeremeta/yarspg) and
[GDL](https://github.com/s1ck/gdl), both more complex than PG.

Many more graph formats exist (
[GraphSON](https://tinkerpop.apache.org/docs/3.7.1/dev/io/#graphson),
[JGF](http://jsongraphformat.info/),
[GraphML](http://graphml.graphdrawing.org/),
[dot](https://graphviz.org/doc/info/lang.html),
[GML](https://en.wikipedia.org/wiki/Graph_Modelling_Language)...)
some of which might also be able to serialize property graphs.

*This implementation is work in progress. It may slightly differ from the format described in <https://arxiv.org/abs/1907.03936>!*

### PG format

A PG file serializes a progerty graph, consisting of **nodes** and **edges** as
Unicode string. The format is based on lines, separated by newlines (`U+000A` or
`U+000D` followed by `U+000A`).

...TODO... 

### PG-JSON format

The PG-JSON format is described by JSON Schema file `schema.json` in this
repository. Additional rules not covered by the schema:

- node ids must be unique
- nodes referenced in edges must be defined

### Example

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

## Install

This package has not been published at npm so you need to clone it from its git repository.

## Usage

~~~
import { parse, serialize } from "pgraph"

const graph = {
  nodes: [ ... ],
  edges: [ ... ] 
}

const pgstring = serialize(graph)

const graph = parse(pgstring)
~~~

### CLI

`./bin/pg2json.js` and `./bin/json2pg.js` parse and serialize, respectively.

## License

Licensed under the MIT License.

Created by Hirokazu Chiba, Ryota Yamanaka, and Shota Matsumoto

See <https://arxiv.org/abs/1907.03936> for reference.

Code forked from <https://github.com/g2glab/pg/> by Jakob Voß
