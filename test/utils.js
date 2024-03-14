import path from "path"
import fs from "fs"

const __dirname = new URL(".", import.meta.url).pathname
export const localPath = name => path.resolve(__dirname, name)
export const readFile = path => fs.readFileSync(localPath(path)).toString()
export const readExample = file => readFile(`../examples/${file}`)

// lazy graph constructor for testing
export const graph = (nodes = [], edges = []) => {
  if (typeof nodes === "string") {nodes = nodes.split("|")}
  nodes = nodes.map(id => (typeof id === "string" ? { id } : id))
  edges = edges.map(e => (Array.isArray(e) ? { from: e[0], to: e[1] } : e)) 
  for (const e of [...nodes, ...edges]) {
    e.labels ??= []
    e.properties ??= {} 
    for (const [key, value] of Object.entries(e.properties)) {
      if (!Array.isArray(value)) {
        e.properties[key] = [value]
      }
    }
  }
  return { nodes, edges }
}
