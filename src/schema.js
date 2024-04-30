
// return supported type from PG type (number|string) 
const datatype = value => {
  if (typeof value === "number") {
    return Number.isInteger(value) ? "int" : "float"
  } else if (typeof value === "boolean") {
    return "boolean"
  } else {
    return "string"
  }
}

export class FieldSchema extends Map {
  #options

  constructor(options = {}) {
    super()
    this.#options = options
  }

  extend(properties) {
    for (let [name, values] of Object.entries(properties)) {
      if (this.#options.namePattern && !this.#options.namePattern.test(name)) {
        // TODO: warn on ignored property
        continue
      }

      let { type, repeated } = this.get(name) || { }
      repeated ||= values.length > 1

      for (const value of values) {
        let valuetype = datatype(value)

        if (type == null) {
          type = valuetype
        } else if (type !== valuetype) {
          // TODO: separate int and float
          if ((type == "int" || valuetype == "int")
            && (type == "float" || valuetype == "float")) {
            valuetype = "float"
            type = "float"
          } else {
            // TODO: move to warner
            console.log("WARNING: Neo4j CSV cannot serialize mixed property types, using string instead!")
            valuetype = "string"
            type = "string"
          }
        }

        if (!(this.has(name)) 
            || this.get(name).type != type 
            || this.get(name).repeated != repeated) {
          this.set(name, { type, repeated } )
        }
      }
    } 
  }
}
