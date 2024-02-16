#!/usr/bin/bash
# start new docker container

cwd=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)

mkdir -p "$cwd/data"
mkdir -p "$cwd/import"

docker run -d \
    --name=neo4j \
    --publish=7474:7474 --publish=7687:7687 \
    --env NEO4J_AUTH=none \
    --user $(id -u):$(id -g) \
    --volume=$cwd/data:/data \
    --volume=$cwd/import:/var/lib/neo4j/import \
    neo4j 
