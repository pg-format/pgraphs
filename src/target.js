import fs from "fs"

export class GraphTarget { }

export class MultiTarget extends GraphTarget {
  constructor(base) {
    super()
    this.base = base
  }

  open(suffix) {
    const file = this.base + suffix
    console.log(file)
    return fs.createWriteStream(file)
  }
}

export class StreamTarget extends GraphTarget  {
  constructor(stream) {
    super()
    this.stream = stream
  }

  open() {
    return this.stream
  }
}

export class StringTargets extends GraphTarget  {
  constructor() {
    super()
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
