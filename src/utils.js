import { Writer } from "@pinemach/csv"
export const CSVWriter = Writer

// Maps arbitrary identifier strings to enumerated identifiers 
export class IDMap extends Map {
  constructor(base="") {
    super()
    this.base = base
  }

  map(id) {
    if (this.has(id)) {
      return this.get(id)
    } else {
      const mapped = `${this.base}${this.size+1}`
      this.set(id, mapped)
      return mapped
    }
  }
}   


