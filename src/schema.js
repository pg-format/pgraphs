
// return supported type from PG type (number|string) 
const datatype = value => {
  if (typeof value === "number") {
    return Number.isInteger(value) ? "INT" : "FLOAT"
  } else if (typeof value === "boolean") {
    return "BOOLEAN"
  } else {
    return "STRING"
  }
}

/**
 * Consists of:
 * - a datatype
 * - a uniqueness flag (aka primary key)
 * - a required flag (aka not null)
 * - a repeatable flag (aka list type)
 */
class PropertyConstraint {
  constructor(value) {
    if (typeof value == "string") {value = PropertyConstraint.parse(value)}
    const {type,unique,required,repeatable} = value
    this.type = type.toUpperCase() ?? "STRING"
    this.unique = !!unique
    this.required = required ?? undefined
    this.repeatable = repeatable ?? undefined
  }

  static parse(str) {
    const [type, unique, flag] = str.match(/^(.+?)(-[Ii][Dd])?([!?*+])?/).slice(1)
    return {
      type: type.toUpperCase(),
      unique: !!unique,
      required: flag ? (flag == "!" || flag == "+") : undefined,
      repeatable: flag ? (flag == "+" || flag == "*"): undefined,
    }
  }

  toValue() {
    var s = this.type
    if (this.unique) {s += "-ID"}
    // It's not possible to stringify one of required/repeatable being undefined only!
    if (this.required != undefined || this.repeatable != undefined) {
      s += this.required
        ? (this.repeatable ? "+" : "!")
        : (this.repeatable ? "*" : "?")
    }
    return s
  }
}

// Map of property keys to { type, repeatable }
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

      let { type, repeatable } = this.get(name) || { }
      repeatable ||= values.length > 1

      for (const value of values) {
        let valuetype = datatype(value)

        if (type == null) {
          type = valuetype
        } else if (type !== valuetype) {
          // TODO: separate int and float
          if ((type == "INT" || valuetype == "INT")
            && (type == "FLOAT" || valuetype == "FLOAT")) {
            valuetype = "FLOAT"
            type = "FLOAT"
          } else {
            // TODO: move to warner
            console.log("WARNING: Neo4j CSV cannot serialize mixed property types, using string instead!")
            valuetype = "STRING"
            type = "STRING"
          }
        }

        if (!(this.has(name)) 
            || this.get(name).type != type 
            || this.get(name).repeatable != repeatable) {
          this.set(name, new PropertyConstraint({ type, repeatable }) )
        }
      }
    } 
  }
}
