# Conceptual Features of Graph Formats and Databases

*Working draft by Jakob Voß. Please get in contact if you would like to contribute to a joint paper!*

Several formats and conventions exist to serialize labeled property graphs or
other kinds of graphs. Each format has an explicit or implied data model of
graphs with a set of features that can be represented in the format.

## Related work

Tomaszuk et a.l. (2019) did a survery of property graph database systems and
serialization formats. The survey of Roughan and Tuke (2015) is more
comprehensive with focus on other kinds of graphs. Meanwhile more formats have
been created, so both are outdated. Moreover no previous work attempted to
implement executable mappings between graph formats. Several minor differences
and special features only appear during implementation as done in the pgraphs
application. For instance the direction of edges is not only
directed/undirected but some formats support either of both and some support
both mixed in the same graph.

<!--
The support of different graph features in database
systems can be summarized as following:

- node labels
  - optional: Neo4J, JanusGraph, Amazon Neptune, InfoGrid, Memgraph, AgensGraph
  - repeatable: Neo4j, Amazon Neptune, InfoGrid, Memgraph, AgensGraph
- edge labels:
  - optional: *none*
  - repeatable: AgensGraph
- edges
  - undirected: OrientDB, ArangoDB, JanusGraph, TigerGraph, InfiniteGraph, InfoGrid, Sparksee, VelicityDB
  - multiple between same nodes: all but InfoGrid
  - multiple between same nodes with same edge label(s): all but TigerGraph and InfoGrid
- properties
  - multiple values with same key: all but InfoGrid, Sparksee, and HGraphDB
  - null-values: OrientDB, ArangoDB, InfiniteGraph, InfoGrid, Sparksee, Memgraph, VelocityDB, HGraphDB
-->

## Comparision of Graph Features

The file **[features.csv](features.csv)** contains a comparision of data model
features of various data formats and databases for graphs. The features are
defined in [a JSON Schema](../schema/features.json) and in pgraph source files
for each format:

<!-- jq -r '.properties|to_entries|map(["",.key,.value.description//"",""]|join("|"))[]' schema/features.json -->

|feature|description|
|-------|-----------|
|id|locally unique identifier of the graph format|
|name|Name of the graph format|
|direction|Whether all edges are in a graph are directed, undirected, either/or, or can be mixed|
|multiEdges|The same edge can appear multiple times in a graph|
|graphAttributes|Graphs can have arbitrary attributes|
|nodeAttributes|Nodes can have arbitrary attributes|
|edgeAttributes|Edges can have arbitrary attributes|
|visualAttributes|Nodes and edges can have special attributes for visual layout|
|edgeWeight|Edges can have a numeric weight value|
|nodeTypes|Type or category of a node. Known as 'label' in labeled property graphs|
|edgeTypes|Type or category of an edge. Known as 'label' in labeled property graphs|
|nodeName|Special field to name an individual node|
|edgeName|Special field to name an individual edge|
|hierarchy|Are subgraphs expressible and if so, can a node have multiple parents?|
|hyperEdges|Allow edges that connect more than one node|
|datatypes|Attributes can have different datatypes|

Note that generic attributes *can* be used to encode visual attributes, types,
and names but if the format does not explicitly specify the latter (possibly as
attributes of known name), the format does not natively support visual
attributes, types, and/or names! An example is the support of edge weight. Graphml exemplifies edge attributes by showing how to define a custom attribute named "weight" but the Graphml specification does not enforce this attribute nor its semantics, so GraphML *can* be used to encode edge weights but it does not support edge weights out-of-the-box.

## Additional graph formats

Additional graph formats listed in Tomaszuk et al (2019) but not taken into account here include

- [DotML](https://martin-loetzsch.de/DOTML/) and [S-Dot](https://martin-loetzsch.de/S-DOT/) (alternative serializations of Graphiviz Dot format)
- [YGF](https://docs.yworks.com/yfiles/doc/developers-guide/ygf.html) (proprietary binary format)

## References

- Dominik Tomaszuk, Renzo Angles, Łukasz Szeremeta, Karol Litman & Diego Cisterna (2019):
  *Serialization for Property Graphs* <https://doi.org/10.1007/978-3-030-19093-4_5>

- Matthew Roughan, Jonathan Tuke (2015):
  *Unravelling graph-exchange file formats*  <https://arxiv.org/abs/1503.02781>

