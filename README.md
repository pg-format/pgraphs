# pgraph

> Property Graph Exchange Format (PG) parser and serializer

This package implements parser and serializer of PG format for (labeled) property graphs. 

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
  - [API](#api)
  - [CLI](#cli)
- [Example](#example)
- [License](#license)

## Background

**Property Graphs** (also known as **Labeled Property Graphs**) are used as
abstract data structure in graph databases and related applications. This
package implements the **Property Graph Exchange Format (PG)** with parsers
and serializers from and to various formats.

A property graph consists of **nodes** and **edges** between these nodes. Each
edge can be directed or undirected.  Each of the nodes and edges can have a set
of zero or more **labels** and a set of and zero or more properties.
**properties** are key-value pairs where the same key may have multiple values.
**values** are Unicode strings or scalar values of other data types.

Implementations of property graphs slightly differ in support of data types,
restrictions on labels etc. The property graph model PG is aimed to be a
superset of property graph models of common graph databases. The model and its
serializations **PG format** and **PG-JSON** have first been
proposed by Hirokazu Chiba, Ryota Yamanaka, and Shota Matsumoto
([2019](https://arxiv.org/abs/1907.03936), [2022](https://arxiv.org/abs/2203.06393)).
The additional format **PG-NDJSON** has been derived from PG-JSON.

A [formal description of Property Graph Exchange Format ](./docs/pg-format.md)
and [an illustrating example](./docs/pg-format.pg) can be found [in the `docs`
directory](./docs) of this repository. There is also a JSON Schema
[`pg-schema.json`](pg-schema.json) to define and validate PG-JSON.

See [below for an example](#example) of the same graph in multiple serializations.

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

The script `bin/pgraph.js` is installed as command `pgraph` to convert between property graph serializations:

~~~
Usage: pgraph [options] [<input> [<output]]

Convert between property graph serializations.

Options:
  -f, --from [format]  input format (dot|json|ndjson|pg)
  -t, --to [format]    output format (dot|json|ndjson|pg|xml)
  -v, --verbose        verbose error messages
  -h, --help           show usage information
  -V, --version        show the version number
Usage: pgraph [options] [<input> [<output]]
~~~

`./bin/neo2pg.js` can be used to dump the default graph from a Neo4J database. First argument must be a JSON file with credentials like this:

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

The same graph in PG format, PG-JSON and PG-NDJSON:

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

~~~json
{"id":"101","labels":["person"],"properties":{"name":["Alice"],"country":["United States"]}}
{"id":"102","labels":["person","student"],"properties":{"name":["Bob"],"country":["Japan"]}}
{"from":"101","to":"102","undirected":true,"labels":["same_school","same_class"],"properties":{"since":[2012]}}
{"from":"101","to":"102","labels":["likes"],"properties":{"since":[2015]}}
~~~

When exported to GraphViz dot format, labels are ignored:

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

When exported to GraphML, labels are ignored as well and all values are converted to strings
(support of data types has not been implemented yet):

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

## License

Licensed under the MIT License.

PG has been created by Hirokazu Chiba, Ryota Yamanaka, and Shota Matsumoto.
See <https://arxiv.org/abs/1907.03936> for reference.

Implementation forked from <https://github.com/g2glab/pg/> by Jakob Voß.
