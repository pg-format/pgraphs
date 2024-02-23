// Trivial Graph Format (TGF)
// properties and line breaks in labels are ignored and only the first label is used

import { IDMap } from "../utils.js"

const useLabel = labels =>
  labels.length ? " " + labels[0].replaceAll(/[\r\n]/g,"") : ""

export default ({ nodes, edges }) => {
  const ids = new IDMap()

  const serializeNode = ({ id, labels }) =>
    ids.map(id) + useLabel(labels)
  const serializeEdge = ({ from, to, labels }) =>
    ids.map(from) + " " + ids.map(to) + useLabel(labels)
  
  return [ 
    ...nodes.map(serializeNode),
    "#",
    ...edges.map(serializeEdge), 
  ].join("\n")
}
