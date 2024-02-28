#!/usr/bin/bash
set -euo pipefail

rules=$(grep -o -e '[A-Za-z0-9-]\+.svg' docs/pg-grammar.md | sed s/\.svg//)

for svg in $rules; do
  parts=(${svg//-/ })
  rule=${parts[0]}
  depth=${parts[1]:-0}
  npm run --silent peggy-tracks -- --css docs/diagram.css --quote '' -s $rule -d $depth ./src/pg.pegjs -o docs/$svg.svg
  echo $svg
done

pandoc -s docs/pg-grammar.md -o docs/pg-grammar.html
