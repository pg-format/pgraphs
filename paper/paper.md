---
title: "pgraphs: Property Graph Exchange Format (PG) converter"
tags:
  - JavaScript
  - Graphs
  - Databases
authors:
  - name: Jakb Voß
    orcid: 0000-0002-7613-4123
    affiliation: "1"
affiliations:
  - name: Verbundzentrale des GBV (VZG)
    index: 1
    ror: 048vdhs48 
date: 2025-02-23
bibliography: paper.bib
---

# Summary

Graphs (networks of vertices/nodes connected by edges/links/arcs) are relevant
for data modeling and exchange in all kinds of scientific research, with
application from network analysis to knowledge representation. Several variants
of graphs exist with differing capabilities, and many more formats have been
created to store and exchange graph data [@Tomaszuk2019;Roughan2015].

Pgraphs aims to support conversion between most of these graph data formats.
Its internal data model is based, on but not limited to the Property Graph Exchange Format (PG)
[@PG2024]

[^1]

[^1]: Also available at <https://pg-format.github.io/specification/>.

# Statement of need

Property graph data is bound to applications.

Standardization has progressed with GQL? 2025
formerly known as Cypher

A graph-based data format for intergation of data: RDF

...

# Implementation

Each format is described with format capabilities, for instance ...

If some feature is not supported by an output format, the graph is reduced and a warning is shown.

# Usage

pgraphs is distributed as [npm package](https://www.npmjs.com/package/pgraphs)
and as [Docker image](https://github.com/pg-format/pgraphs/pkgs/container/pgraphs).
The command line application `pgraph` reads a graph from input file(s) in one format
and writes ...

This also includes writing into graph databases.

TODO:

- diagram/table of formats
- Graph features

# Related works

PG Format is similar to YARS-PG (Szeremeta2024) and to gram <https://gram-data.github.io/gram-js/>
but not limited to property graphs.

Converters for documents: pandoc (not comparable, much more mature)

# Acknowledgements

This work was supported by ...

# References

