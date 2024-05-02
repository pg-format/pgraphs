const xmlEntity = {
  ">": "&gt;",
  "<": "&lt;",
  "'": "&apos;",
  "\"": "&quot;",
  "&": "&amp;",
}

export const xmlEscape = s => `${s}`.replaceAll(/[&"<>']/g, c => xmlEntity[c])

export default class XMLWriter {
  constructor(name, attr={}) {
    this.lines = ["<?xml version=\"1.0\" encoding=\"UTF-8\"?>"]
    this.stack = []
    this.start(name, attr)
  }

  start(name, attr={}) {
    this._line(`<${name}${this._attr(attr)}>`)
    this.stack.push(name)
  }

  end() {
    this._line(`</${this.stack.pop()}>`)
  }

  element(name, attr={}, content) {
    if (content === undefined) {
      this._line(`<${name}${this._attr(attr)}/>`)
    } else {
      this._line(`<${name}${this._attr(attr)}>${xmlEscape(content)}</${name}>`)
    }
  }

  _line(xml) {
    this.lines.push("  ".repeat(this.stack.length) + xml)
  }

  _attr(attr) {
    if (!Object.keys(attr).length) {return ""}
    return " " + Object.keys(attr).map(key => `${key}="${xmlEscape(attr[key])}"`).join(" ")
  }

  toString() {
    while(this.stack.length > 0) { this.end() }
    return this.lines.join("\n")+"\n"
  }
}
