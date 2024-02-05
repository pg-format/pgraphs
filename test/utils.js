import path from "path"
import fs from "fs"

const __dirname = new URL(".", import.meta.url).pathname
export const localPath = name => path.resolve(__dirname, name)
export const readFile = path => fs.readFileSync(localPath(path)).toString()
