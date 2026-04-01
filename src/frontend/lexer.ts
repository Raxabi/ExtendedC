/**
 * Lexer/Scanner prototype for ScrapLang
 * 
 * The Lexer scans a file and reads its contents to extract tokens
 * that correspond to the language syntax definitions.
 * 
 * For example, `const`, `fn`, `enum`... are keywords and the Lexer
 * will recognize them as such.
 * 
 * If the Lexer encounters an invalid token, it will throw an error.
 */

import { basename } from "@std/path/basename"
import { Maybe }    from "@/typings.ts";
import { Collectable, Reader } from "@frontend/typings.ts"
import { Position } from "@/position.ts"
import { KEYWORDS, Token, TokenType } from "@frontend/tokens.ts"

/** Detects alphabetic characters (ignoring Cases) */
function isAlpha(char: string) {
  return /[a-zA-Z_]/.test(char)
}

/** Detects alphanumeric characters */
function isAlphaNum(char: string) {
  return /[0-9a-zA-Z_$]/.test(char)
}


/** Detects valid binary numbers */
function isBin(char: string) {
  return /[0-1]/.test(char)
}

/** Detects valid octal numbers */
function isOctal(char: string) {
  return /[0-8]/.test(char)
}

/** Detects valid hexadecimal numbers */
function isHexadecimal(char: string) {
  return /[0-9a-fA-F]/.test(char)
}

/** Detects numeric characters */
function isNumeric(char: string) {
  return /[0-9_]/.test(char)
}

/** Detects whitespaces characters */
function isSpace(char: string): char is ' ' {
  return char === ' '
}

/** Detects End Of Line characters */
function isEOL(char: string): char is '\r' | '\n' {
  return char === '\r' || char === '\n'
}

/**
 * Main Lexer class implementing `Collectable<Token>` and `Reader<string>`.
 * It reads a source file and transforms it into a sequence of tokens.
 */
export default class Lexer implements Collectable<Token>, Reader<string> {
  /** Source file being scanned */
  private source: string

  /** Source file name */
  public name: string
  
  /** Flag indicating whether end of file has been reached */
  private eof: boolean
  
  /** Current position in the file (line, column, index) */
  private position: Position

  /** Current character being processed by the Lexer */
  current: string

  /**
   * Private constructor: initializes the Lexer with the given file path.
   * Use `Lexer.init` instead of calling this directly.
   */
  private constructor(filePath: string) {
    this.source = Deno.readTextFileSync(filePath)
    this.name = basename(filePath)
    this.eof = false
    this.position = new Position(0, 1, 0)
    this.current = '\0' // null char to start
  }

  /**
   * Static initializer for creating a new Lexer instance and
   * performing the first read from the file.
   * @param filePath Path of the source file to scan
   * @returns An initialized `Lexer` instance
   */
  public static init(filePath: string) {
    const l = new this(filePath)
    l.next() // initializes `currentTok` with the first character
    return l
  }

  // ===== COLLECTABLE FUNCTIONS =====

  /**
   * Collects all tokens from the file until EOF
   * @returns Array of tokens
   */
  collect(): Token[] {
    return Array.from(this)
  }

  // ===== READER FUNCTIONS =====

  /**
   * Reads the next character from the {@link source}
   * @returns The next character
   */
  next(): Maybe<string> {
    return this.nextN(0)
  }

  /**
   * Advances `n` positions in the {@link source}
   * 
   * @param n Number of positions to move (positive or negative)
   * @returns The character resulting from the move, or `undefined` if EOF is reached
   */
  nextN(n: number): Maybe<string> {
    const char = this.source.at(this.position.idx += n)
    this.eof = !!char
    this.current = char ?? '\0'

    return char
  }

  /**
   * Peeks ahead at the next character without consuming it
   * @returns The next character or `undefined` if EOF is reached
   */
  ahead(): Maybe<string> {
    return this.source.at(this.position.idx + 1)
  }

  /**
   * Checks whether the next character matches a given string
   * @param maybe Character to check against
   * @returns `true` if match, `false` otherwise
   */
  check(maybe: string): boolean {
    return this.ahead() === maybe
  }

  /**
   * Checks if the next character matches a given string and consumes it if so
   * @param maybe Character to match and consume
   * @returns The consumed character if it matches, undefined otherwise
   */
  match(maybe: string): Maybe<string> {
    if (this.check(maybe)) {
      const char = this.next()
      this.current = char! // SAFETY: `char` is guaranteed to be defined here since `check` returned true

      return this.next()
    }

    return undefined
  }

  /**
   * Returns whether the end of the file has been reached
   */
  get EOF(): boolean {
    return this.eof
  }

  /*** ======= HELPER FUNCTIONS ======= ***/

  // ===== LEXER FUNCTIONS =====

  /**
   * Consumes end-of-line characters (`\r`, `\n`)
   * Updates line counters accordingly.
   */
  private consumeEOL(): void {
    while (isEOL(this.current)) {
      this.next() // consume the EOL char
      if (!isEOL(this.current))
        break

      if (this.current === '\r')
        this.consumeEOL()
    }
  }

  /**
   * Scans a string literal
   * @returns A {@link Token} which `type` is {@link TokenType.STRING|STRING}
   */
  private scanString(): Token {
    let content = ""
    this.next() // eat opening quote

    do
      content += this.current
    while (this.next() !== '"')

    this.next() // eat closing quote
    return new Token(TokenType.STRING, content)
  }

  /**
   * Scans a character literal
   * @returns A {@link Token} which `type` is {@link TokenType.CHAR|CHAR}
   */
  private scanChar(): Token {
    let content = ""
    this.next() // eat opening quote

    do
      content += this.current
    while (this.next() !== '\'')
    
    this.next() // eat closing quote
    return new Token(TokenType.CHAR, content)
  }

  /**
   * Scans an identifier or a keyword
   * @returns A {@link Token} which `type` is either a keyword from {@link TokenType} or {@link TokenType.IDENTIFIER|IDENTIFIER}
   */
  private scanIdentifierOrKeyword() {
    let content = ""

    do {
      content += this.current
      this.next()
    } while (isAlphaNum(this.current) && !this.EOF)


    const type = KEYWORDS.get(content) ?? TokenType.IDENTIFIER
    return new Token(type, content)
  }

  /**
   * Scans a binary number literal starting with `0b` or `0B`
   * @returns 
   */
  private scanBinaryNumber() {
    let content = ""
    content += this.next() // 0
    content += this.next() // b

    do {
      content += this.current
      this.next()
    } while (isBin(this.current) && !this.EOF)
    
    return new Token(TokenType.NUMBER, content)
  }

  /**
   * Scans an octal number literal starting with `0o` or `0O`
   * @returns 
   */
  private scanOctalNumber() {
    let content = ""
    content += this.next() // 0
    content += this.next() // o

    do {
      content += this.current
      this.next()
    } while (isOctal(this.current) && !this.EOF)

    return new Token(TokenType.NUMBER, content)
  }

  /**
   * Scans a hexadecimal number literal starting with `0x` or `0X`
   * @returns 
   */
  private scanHexadecimalNumber() {
    let content = ""
    content += this.next() // 0
    content += this.next() // x

    do {
      content += this.current
      this.next()
    } while (isHexadecimal(this.current) && !this.EOF)
    
    return new Token(TokenType.NUMBER, content)
  }

  /**
   * Scans a numeric literal (integer or float)
   * @returns A NUMBER token
   */
  private scanNumber() {
    // Check for binary, octal, or hexadecimal literals starting with `0`
    if (this.check('0')) {
      switch (this.ahead()) {
        case 'b': case 'B': return this.scanBinaryNumber()
        case 'o': case 'O': return this.scanOctalNumber()
        case 'x': case 'X': return this.scanHexadecimalNumber()
      }
    }

    let content = ""

    do {
      content += this.current
      this.next()
    } while (isNumeric(this.current) && !this.EOF)

    return new Token(TokenType.NUMBER, content)
  }

  /**
   * Scans a line comment starting with `//`
   * @returns A COMMENT token
   */
  private scanLineComment(): Token {
    this.nextN(2) // eats `//`
    let content = ""

    // `while` loop is used instead of `do-while` to avoid including the EOL character in the comment content
    while (!isEOL(this.current) && !this.EOF) {
      content += this.current
      this.next()
    }

    return new Token(TokenType.COMMENT, content)
  }

  /**
   * Scans a block comment
   * @returns A COMMENT token
   */
  private scanBlockComment(): Token {
    this.nextN(2) // eats `/*`
    let content = ""

    // `while` loop is used instead of `do-while` to avoid including the EOL character in the comment content
    while (this.current !== '*' && this.check('/')) {
      content += this.current
      this.next()
    }

    this.nextN(2) // eats `*/`
    return new Token(TokenType.COMMENT, content)
  }

  /**
   * Scans a slash `/`, checking for comments or division operator
   * @returns A SLASH token (comments are skipped)
   */
  private scanSlash() {
    const ahead = this.ahead()

    switch (ahead) {
      case '/': return this.scanLineComment()
      case '*': return this.scanBlockComment()
    }

    this.next() // eats `/`
    return new Token(TokenType.SLASH, "/")
  }

  /**
   * Scans `=` (assignment) or `==` (equality)
   */
  private scanEqual() {
    if (this.check("=")) {
      this.nextN(2) // eats `==`
      return new Token(TokenType.EQUALS, "==")
    }

    this.next() // eats `=`
    return new Token(TokenType.EQUAL, "=")
  }

  private scanDot() {
    this.next() // eats `.`
    return new Token(TokenType.DOT, ".")
  }

  private scanPlus(): Token {
    if (this.check("+")) {
      this.nextN(2) // eats `++`
      return new Token(TokenType.INCREMENT, "++")
    }

    this.next() // eats `+`
    return new Token(TokenType.PLUS, "+")
  }

  private scanMinus(): Token {
    if (this.check("-")) {
      this.nextN(2) // eats `--`
      return new Token(TokenType.DECREMENT, "--")
    }

    this.next() // eats `-`
    return new Token(TokenType.MINUS, "-")
  }

  /**
   * Scans `!` or `!=`
   */
  private scanBang() {
    if (this.check("=")) {
      this.nextN(2) // eats `!=`
      return new Token(TokenType.NOT_EQUALS, "!=")
    }

    this.next() // eats `!`
    return new Token(TokenType.BANG, "!")
  }

  /**
   * Scans `>` (greater than) or `>=` (greater than or equal) or `>>` (right shift)
   * @returns 
   */
  private scanGreater() {
    // Instead of using check twice, we peek ahead manually to avoid a probably redundant call to `ahead()`
    const ahead = this.ahead()

    if (ahead === '=') {
      this.nextN(2) // eats `>=`
      return new Token(TokenType.GREAT_EQUAL, ">=")
    }

    if (ahead === '>') {
      this.nextN(2) // eats `>>`
      return new Token(TokenType.RIGHT_SHIFT, ">>")
    }

    this.next() // eats `>`
    return new Token(TokenType.GREATER, ">")
  }

  /**
   * Scans `<` (less than) or `<=` (less than or equal) or `<<` (left shift)
   * @returns 
   */
  private scanLess() {
    // Instead of using check twice, we peek ahead manually to avoid a probably redundant call to `ahead()`
    const ahead = this.ahead()

    if (ahead === '=') {
      this.nextN(2) // eats `<=`
      return new Token(TokenType.LESS_EQUAL, "<=")
    }

    if (ahead === '<') {
      this.nextN(2) // eats `<<`
      return new Token(TokenType.LEFT_SHIFT, "<<")
    }

    this.next() // eats `<`
    return new Token(TokenType.LESS, "<")
  }

  /**
   * Scans `|` (pipe) or `||` (logical OR)
   * @returns 
   */
  private scanPipe() {
    if (this.check("|")) {
      this.nextN(2) // eats `||`
      return new Token(TokenType.NAMED_OR, "||")
    }

    this.next() // eats `|`
    return new Token(TokenType.PIPE, "|")
  }

  /**
   * Scans `&` (ampersand) or `&&` (logical AND)
   * @returns 
   */
  private scanAmpersand() {
    if (this.check("&")) {
      this.nextN(2) // eats `&&`
      return new Token(TokenType.NAMED_AND, "&&")
    }

    this.next() // eats `&`
    return new Token(TokenType.AMPER, "&")
  }

  /**
   * Handles single-character tokens such as brackets, commas, etc,
   * as well as delegating scanning for multi-character tokens.
   */
  private scanSingleChar(): Token {
    switch (this.current) {
      case '>':  return this.scanGreater()
      case '<':  return this.scanLess()
      case '&':  return this.scanAmpersand()
      case '|':  return this.scanPipe()
      case '+':  return this.scanPlus()
      case '-':  return this.scanMinus()
      case '=':  return this.scanEqual()
      case '!':  return this.scanBang()
      case '/':  return this.scanSlash()
      case '.':  return this.scanDot()
      case '"':  return this.scanString()
      case '\'': return this.scanChar()

      case '{':  return new Token(TokenType.LBRACE, "{")
      case '}':  return new Token(TokenType.RBRACE, "}")
      case '(':  return new Token(TokenType.LPAREN, "(")
      case ')':  return new Token(TokenType.RPAREN, ")")
      case '[':  return new Token(TokenType.LSQRBR, "[")
      case ']':  return new Token(TokenType.RSQRBR, "]")
      case ',':  return new Token(TokenType.COMMA, ",")
      case ';':  return new Token(TokenType.SEMICOLON, ";")
      case '?':  return new Token(TokenType.QUESTION, "?")
      case '#':  return new Token(TokenType.HASH, "#")
    }

    // Ignore spaces and newlines by rescanning
    if (isSpace(this.current) || isEOL(this.current))
      return this.scan()

    return new Token(TokenType.UNKNOWN, this.current)
  }

  /**
   * Main scan method: processes the current character and returns a token
   * @returns The next token from the source
   */
  public scan(): Token {
    if (this.EOF)
      return new Token(TokenType.EOF, '\0')

    while (isSpace(this.current))
      this.next()

    if (isEOL(this.current))
      this.consumeEOL()

    if (isAlpha(this.current))
      return this.scanIdentifierOrKeyword()

    if (isNumeric(this.current))
      return this.scanNumber()

    return this.scanSingleChar()
  }

  /**
   * Returns a copy of the current position in the file
   */
  public get Position(): Position {
    return this.position.clone()
  }

  public set Position(pos: Position) {
    this.position = pos
  }

  *[Symbol.iterator]() {

  }
}
