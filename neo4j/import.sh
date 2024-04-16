#!/usr/bin/bash
set -euo pipefail

cwd=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)

if [[ $# -eq 0 ]]; then
  echo "Please specify base name of CSV files (starting with 'import/') as first argument!"
  exit 0
fi

require() {
  if [[ ! -f "$1" ]]; then
    echo "Missing CSV import file $1!" 
    exit 1
  fi
}

base="import/$1"
delimiter=","
ext=csv
arrayDelimiter=";"

require "$cwd/$base.nodes.header"
require "$cwd/$base.nodes.$ext"
require "$cwd/$base.edges.header"
require "$cwd/$base.edges.$ext"

importcommand="./bin/neo4j-admin database import full --overwrite-destination --nodes=$base.nodes.header,$base.nodes.$ext --relationships=$base.edges.header,$base.edges.$ext --delimiter=\"$delimiter\" --array-delimiter=\"$arrayDelimiter\""

echo "stopping neo4j"
docker stop neo4j

echo "importing data from $base.{nodes,edges}.{header,$ext}"
docker run \
    --name=neo4j_import \
    --entrypoint="/bin/bash" -it \
    --env NEO4J_AUTH=none \
    --env NEO4J_AUTH=none \
    --user $(id -u):$(id -g) \
    --volume=$cwd/data:/data \
    --volume=$cwd/import:/var/lib/neo4j/import \
    --rm \
    neo4j -c "ls /var/lib/neo4j/import; $importcommand"

echo "restarting neo4j"
docker start neo4j
