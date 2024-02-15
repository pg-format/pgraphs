# pgraph

> Property Graph Exchange Format (PG) parser and serializer

This package implements parsers and serializers to convert between labeled
property graph formats. See [below for an examples](#examples).

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
  - [API](#api)
  - [CLI](#cli)
- [Examples](#examples)
  - [PG format](#pg-format)
  - [PG JSON and NDJSON](#pg-json-and-ndjson)
  - [GraphViz DOT](#graphviz-dot)
  - [GraphML](#graphml)
  - [YARS-PG](#yars-pg)
- [License](#license)

## Background

A **property graph** (also known as **labeled property graph**) is an abstract
data structure used in graph databases and related applications. It consists of
**nodes** and **edges** between these nodes. Each edge can be directed or
undirected.  Each of the nodes and edges can have a set of zero or more
**labels** and a set of and zero or more properties. **properties** are
key-value pairs where the same key may have multiple values. **values** are
Unicode strings or scalar values of other data types.

Property graphs applications and formats differ in their model by different
support of data types, restrictions on labels etc. This package implements the
**Property Graph Exchange Format (PG)**, aimed to be a superset of common
models, with parsers and serializers from and to various formats.

A first version of the PG model and its serializations **PG format** and
**PG-JSON** have been proposed by Hirokazu Chiba, Ryota Yamanaka, and Shota
Matsumoto ([2019](https://arxiv.org/abs/1907.03936),
[2022](https://arxiv.org/abs/2203.06393)). Additional information included in
this package:

- [formal description of PG model and format](docs/pg-format.md)
- [illustrating example of PG format](./docs/pg-format.pg)
- [JSON Schema of PG-JSON](pg-schema.json)
- [Example directory](examples), also used for unit tests

## Install

This package has not been published at npm so you need to clone it from its git repository.

~~~
git clone https://github.com/gbv/pg.git
cd pg
npm install
~~~

## Usage

### API

~~~
import { pgformat, ParsingError } from "pgraph"

const graph = {
  nodes: [ ... ],
  edges: [ ... ] 
}

try {
  const pgstring = pgformat.pg.serialize(graph)
  const graph = pgformat.pg.parse(pgstring)
} catch (ParsingError e) {
  console.log(`Parsing failed in line ${e.line}`)
}
~~~

### CLI

The script `bin/pgraph.js` is installed as command `pgraph`:

~~~
Usage: pgraph [options] [<input> [<output]]

Convert between property graph serializations.

Options:
  -f, --from [format]  input format (dot|json|ndjson|pg)
  -t, --to [format]    output format (dot|json|ndjson|pg|xml|yarspg)
  -v, --verbose        verbose error messages
  -h, --help           show usage information
  -V, --version        show the version number

Format conversion is supported:
  from and to GraphViz dot (dot)
  from and to PG-JSON (json)
  from and to PG-NDJSON (ndjson)
  from and to PG format (pg)
  to GraphML (xml)
  to YARS-PG 3.0.0 with optional labels (yarspg)
~~~

Experimental script `./bin/neo2pg.js` can be used to dump the default graph
from a Neo4J database. First argument must be a JSON file with credentials like
this:

~~~json
{
  "uri": "neo4j://example.org",
  "user": "alice",
  "password": "secret"
}
~~~

The script requires to install node package `neo4j-driver` (this is done
automatically by calling `npm install` but not if this package is installed as
dependency of another project).

## Example

### PG format

The [following graph](examples/example.pg) in **PG format** with two nodes and
two edges uses features such as multiple labels, and property values, numbers
and boolean values:

~~~
101 :person  name:Alice name:Carol country:"United States"
102 :person  :student  name:Bob  country:Japan
101 -- 102  :same_school  :same_class  since:2012
101 -> 102  :likes  since:2015  engaged:false
~~~

### PG JSON and NDJSON

The same graph [in PG-JSON](examples/example.json) and [in
PG-NDJSON](examples/example.ndjson):

~~~json
{
  "nodes": [{
    "id": "101", "labels": [ "person" ],
    "properties": { "name": [ "Alice", "Carol" ], "country": [ "United States" ] }
   },{
    "id": "102", "labels": [ "person", "student" ],
    "properties": { "name": [ "Bob" ], "country": [ "Japan" ] }
  }],
  "edges": [{
    "from": "101", "to": "102", "undirected": true,
    "labels": [ "same_school", "same_class" ], "properties": { "since": [ 2012 ] }
   },{
    "from": "101", "to": "102",
    "labels": [ "likes" ], "properties": { "engaged": [ false ], "since": [ 2015 ] }
  }]
}
~~~

~~~json
{"id":"101","labels":["person"],"properties":{"name":["Alice","Carol"],"country":["United States"]}}
{"id":"102","labels":["person","student"],"properties":{"name":["Bob"],"country":["Japan"]}}
{"from":"101","to":"102","labels":["same_school","same_class"],"properties":{"since":[2012]},"undirected":true}
{"from":"101","to":"102","labels":["likes"],"properties":{"since":[2015],"engaged":[false]}}
~~~

### GraphViz DOT

When exported [to GraphViz DOT](examples/example.dot) format, labels are ignored:

~~~dot
graph {
  101 [country="United States" name=Alice];
  102 [country=Japan name=Bob];
  101 -- 102 [since=2012];
  101 -> 102 [since=2015];
}
~~~

Parsed again from dot to PG format all edges are undirected, except for digraphs:

~~~
101 country:"United States" name:Alice
102 country:Japan name:Bob
101 -- 102 since:2012
101 -- 102 since:2015
~~~

### GraphML

When exported [to GraphML](examples/example.xml), labels are ignored as well
and all values are converted to strings (support of data types has not been
implemented yet):

~~~xml
<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns">
  <graph edgedefault="undirected">
    <node id="101">
      <data key="name">Alice</data>
      <data key="country">United States</data>
    </node>
    <node id="102">
      <data key="name">Bob</data>
      <data key="country">Japan</data>
    </node>
    <edge source="101" target="102">
      <data key="since">2012</data>
    </edge>
    <edge source="101" target="102">
      <data key="since">2015</data>
    </edge>
  </graph>
</graphml>
~~~

### YARS-PG

At the moment only version 3.0.0 is supported. The graph [in this
format](examples/example.yarspg) is very similar to [PG format](#pg-format):

~~~
<"101">{"person"}["country":"United States","name":["Alice","Carol"]]
<"102">{"person","student"}["country":"Japan","name":"Bob"]
("101")-["same_school"]["since":2012]-("102")
("101")-["likes"]["engaged":false,"since":2015]-("102")
~~~

## License

Licensed under the MIT License.

PG has been created by Hirokazu Chiba, Ryota Yamanaka, and Shota Matsumoto.
See <https://arxiv.org/abs/1907.03936> for reference.

Implementation forked from <https://github.com/g2glab/pg/> by Jakob Voß.
