import fs from "fs"

export class MultiTarget {
  constructor(base) {
    this.base = base
  }
  open(suffix) {
    return fs.createWriteStream(this.base + suffix)
  }
}

export class StringTargets {
  constructor() {
    this.result = {}
  }
  open(suffix) {
    const { result } = this
    result[suffix] = ""
    return { write(s) {
      result[suffix] += s 
    } }
  }
}
