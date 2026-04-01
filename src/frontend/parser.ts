import { SyntaxError }   from "@/errors.ts"
import type { Maybe }    from "@/typings.ts"
import type { Reader }   from "@frontend/typings.ts"
import { Position }      from "@/position.ts"
import { Token, Tokens } from "@frontend/tokens.ts"
import Lexer             from "@frontend/lexer.ts"
import * as ast          from "@frontend/ast.ts"

interface FunctionSignature {
  ret?: ast.TType
  name?: string
  generics?: ast.GenericList,
  params: ast.FunctionParamList,
}

/**
 * Parser class responsible for converting a stream of tokens
 * from the lexer into an Abstract Syntax Tree (AST).
 *
 * It implements the Reader interface and provides methods to parse
 * declarations, statements and expressions
 */
export default class Parser implements Reader<Token> {
  /**
   * The lexer instance used to generate tokens from the source code.
   */
  private lexer: Lexer

  /**
   * The current token being processed by the parser.
   */
  current: Token

  /**
   * Creates a new parser instance with a given lexer.
   * @param lexer The lexer providing tokens.
   */
  private constructor(lexer: Lexer) {
    this.lexer = lexer
  }

  /**
   * Initializes a new Parser instance.
   * @param lexer The lexer providing tokens.
   * @returns A new Parser object.
   */
  public static init(lexer: Lexer) {
    const p = new this(lexer)
    p.next()
    return p
  }

  /**
   * Throws a syntax error with detailed position information.
   * @param message Error message.
   * @throws {SyntaxError}
   */
  public syntaxError(message: string): never {
    throw new SyntaxError(message, this.lexer.name, this.lexer.Position)
  }

  /**
   * Prints a syntax warning to the console.
   * @param message Warning message.
   */
  public syntaxWarn(message: string): void {
    console.warn(message)
  }

  /**
   * Moves forward by `n` tokens.
   * Skips comments automatically.
   * @param n Number of tokens to advance.
   * @returns The last token consumed.
   */
  nextN(n: number): Token {
    for (let i = 0; i < n; i++)
      this.current = this.lexer.scan()

    if (this.current.is(Tokens.COMMENT))
      return this.nextN(1)

    return this.current
  }

  /**
   * Consumes and returns the next token
   * @returns The next token.
   */
  next(): Token {
    return this.nextN(1)
  }

  /**
   * Returns the current token without consuming it
   * @returns The current token.
   */
  ahead(): Token {
    return this.current
  }

  get EOF(): boolean {
    return this.lexer.EOF
  }

  /**
   * Checks if the current token matches the given type
   * @param maybe Token type to compare
   * @returns True if it matches, otherwise false
   */
  check(maybe: Tokens): boolean {
    return !!this.current.is(maybe)
  }

  get Position(): Position {
    return this.lexer.Position
  }

  // ===== HELPER FUNCTIONS =====

  /**
   * Consumes the current token if it matches the expected type, otherwise throws
   * @param type Token type to expect
   * @returns The consumed token
   */
  private eat(type: Tokens, message?: string): Token {
    if (!this.current.is(type)) {
      const expected = stringify(type)
      const found    = this.current.TypeContent
      this.syntaxError(message ?? `Missing '${expected}', found '${found}'`)
    }

    const current = this.current
    this.next()

    return current
  }

  private eats(...kind: Tokens[]) {
    kind.forEach(k => this.eat(k))
  }

  /**
   * Conditionally consumes the current token if it matches the expected type.
   * @param type Token type to check.
   * @returns The consumed token or undefined.
   */
  private match(type: Tokens): Token | undefined {
    if (!this.current.is(type))
      return undefined

    return this.eat(type)
  }

  private matches(...kind: Tokens[]): Token {
    const founded = kind.find(k => this.current.is(k))
    if (!founded)
      this.syntaxError(`Missing '${kind.join(" or ")}', found '${stringify(this.current.type)}'`)

    return this.eat(founded)
  }
  
  private exists(type: Tokens): true | undefined {
    return this.current.is(type)
  }

  /**
   * if `after` is found, then `expected` must exists after it
   * @param expected Expected token type.
   * @returns The next token.
   */
  private aheadMatch(expected: Tokens, after: Tokens): Token | undefined {
    if (!this.match(after))
      return undefined

    const nextToken = this.eat(expected)
    return nextToken
  }

  /**
   * Parses all elements beign enclosed between `open` and `close` according to every `consumer` call.
   * The consume must ensure that the closing delimiter is not consumed. Otherwise, an error will thrown
   * @param open 
   * @param close 
   * @param consumer
   * @returns An array of elements of type `T`
   */
  private parseDelimited<T>(
    open: Tokens,
    close: Tokens,
    consumer: (start: Position) => T
  ): T[] {
    this.eat(open)

    const list: T[] = []
    while (!this.current.is(close))
      list.push(consumer.call(this, this.Position))

    this.eat(close)
    return list
  }

  /**
   * Parse AST nodes as according to `consumer` by {@link parseDelimited} with `Tokens.LBRACE` and `Tokens.RBRACE` as open and close tokens
   * @param consumer Lambda expression which indicates how contents inside `{` and `}` are parsed
   * @returns An array of elements of type `T`
   */
  private parseBlock<T extends ast.ASTNode>(consumer: (start: Position) => T): T[] {
    return this.parseDelimited(Tokens.LBRACE, Tokens.RBRACE, consumer)
  }

  private parseDelimitedList<T extends ast.ASTNode>(
    open: Tokens,
    close: Tokens,
    separator: Tokens,
    consumer: (start: Position) => T
  ): T[] {
    this.eat(open)

    const items = []
    while (!this.current.is(close)) {
      items.push(consumer.call(this, this.Position))

      if (!this.match(separator) && !this.current.is(close))
        this.syntaxError(`Missing separator '${stringify(separator)}' between elements`)
    }

    this.eat(close)
    return items
  }

  private parseDelimitedListIf<T extends ast.ASTNode>(
    open: Tokens,
    close: Tokens,
    separator: Tokens,
    consumer: (start: Position) => T
  ): Maybe<T[]> {
    if (!this.match(open))
      return undefined

    const items = []
    while (!this.current.is(close)) {
      items.push(consumer.call(this, this.Position))

      if (!this.match(separator) && !this.current.is(close))
        this.syntaxError(`Missing separator '${stringify(separator)}' between elements`)
    }

    this.eat(close)
    return items
  }
}
