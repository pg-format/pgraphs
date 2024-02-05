# pgraph

> Property Graph Exchange Format parser and serializer

This package implements parser and serializer of PG format for (labeled) property graphs. 

## Installation

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

## CLI

`./bin/pg2json.js` and `./bin/json2pg.js` parse and serialize, respectively.

## License

Licensed under the MIT License.

Created by Hirokazu Chiba, Ryota Yamanaka, and Shota Matsumoto

See <https://arxiv.org/abs/1907.03936> for reference.

Code forked from <https://github.com/g2glab/pg/> by Jakob Voß
