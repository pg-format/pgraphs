# pgraph

> Property Graph Exchange Format parser and serializer

This package implements parser and serializer of PG format for (labeled) property graphs. 

## Table of Contents

- [Background](#background)
  - [PG format](#pg-format)
  - [PG JSON](#pg-json)

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

A PG file serializes a property graph, consisting of **nodes** and **edges** as
Unicode string. The format is based on lines, separated by newlines (`U+000A` or
`U+000D` followed by `U+000A`).

...TODO... 

### PG-JSON

**PG-JSON** is a serialization of the property graph data model in JSON. A graph is encoded as JSON object with exactely two fields:

- `nodes` an array of nodes
- `edges` an array of edges

Each node is a JSON object with exactely three fields:

- `id` the internal node identifier, being a non-empty string. Node identifiers must be unique per graph.
- `labels` a (possibly empty) array of labels, each being a non-empty string. Labels must be unique per node.
- `properties` a (possibly empty) JSON object mapping non empty strings to non-empty arrays of scalar JSON values (string, number, boolean, or null)

Each edge is a JSON object with one optional and four mandatory fields:

- `undirected` (optional) a boolean value whether the edge is undirected
- `from` an identifier of a node in this graph
- `to` an identifier of a node in this graph
- `labels` a (possibly empty) array of labels, each being a non-empty string. Labels must be unique per edge.
- `properties` a (possibly empty) JSON object with properties with same definition as above in node objects.

The PG-JSON format is also defined by JSON Schema file
[`schema.json`](schema.json) in this repository. Rules not covered
by the schema:

- node ids must be unique per graph
- nodes referenced in edges must be defined
- edges must be unique per graph

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
