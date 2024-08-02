import features from "./features.js"
import { serialize } from "./serialize.js"
import { parse } from "./parser.js"
import { wrapPeggyParser } from "../../utils.js"

function parseGraph(input, options={}) {
  const graph = wrapPeggyParser(parse, input)
  if (options.sort) { // TODO: document this option
    for (let n of graph.nodes) {n.labels.sort()}
    for (let e of graph.edges) {e.labels.sort()}
  }
  return graph
}

export default {
  ...features,
  parse: parseGraph,
  serialize
}
