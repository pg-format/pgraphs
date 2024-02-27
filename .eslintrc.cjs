module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true,
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2022,
  },
  extends: [ "eslint:recommended" ],
  rules: {
    // console.log, console.warn, and console.error can be used.
    "no-console": "off",
    // Always use two spaces, and indent switch-case statements.
    indent: [ "error", 2, { SwitchCase: 1 } ],
    // Use Unix line endings (\n).
    "linebreak-style": [ "error", "unix" ],
    // Use double quotes.
    quotes: [ "error", "double" ],
    "quote-props": [ "error", "as-needed" ],
    // Disallow semicolons
    semi: [ "error", "never" ],
    // Enforce dangling commas for multiline statements
    "comma-dangle": [ "error", "always-multiline" ],
    // Always require curly braces for all control statements
    curly: "error",
    // No single-line braces
    "brace-style": [ "error", "1tbs", { allowSingleLine: false } ],
  },
  // ignore generated file
  ignorePatterns: [ "src/parser/pg.js" ],
}
