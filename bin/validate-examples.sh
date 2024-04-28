#!/bin/bash
set -euo pipefail

for gexf in examples/*.gexf; do
    xmllint --noout --schema test/schemas/gexf.xsd $gexf
done
