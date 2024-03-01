export class ParsingError extends Error {
  constructor(message, line, pos, text) {
    if (line !== undefined) {
      message = message.replace("LINE", `line ${line}`)
    }
    if (pos !== undefined) {
      message = message.replace("POS", `character ${pos + 1}`)
      if (text !== undefined) {
        message = message.replace("CHAR", text.charAt(pos))
        message = message.replace("TEXT", JSON.stringify(text.substring(pos)))
      }
    }
    super(message)
    this.line = line
    this.pos = pos
    this.text = text
  }
}
