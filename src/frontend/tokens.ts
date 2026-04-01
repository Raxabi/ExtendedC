import { Maybe } from "@/typings.ts"

export enum TokenType {
  // ========================
  // KEYWORDS
  // ========================
  CONST,   // const
  STRUCT,  // struct
  RETURN,  // return
  IMPORT,  // import
  TYPEDEF, // typedef
  ENUM,    // enum
  FOR,     // for
  WHILE,   // while
  DO,      // do
  BREAK,   // break
  SKIP,    // skip
  IF,      // if
  ELSE,    // else
  MATCH,   // match
  PUB,     // pub
  STATIC,  // static
  EXTERN,  // extern

  // ========================
  // OPERATORS
  // ========================
  EQUAL,        // =
  QUESTION,     // ?

  PLUS,         // +
  INCREMENT,    // ++
  ADD_ASSIGN,   // +=

  MINUS,        // -
  DECREMENT,    // --
  MINUS_ASSIGN, // -=

  STAR,         // *
  MULT_ASSIGN,  // *=

  SLASH,        // /
  DIV_ASSIGN,   // /=

  PERCEN,       // %
  MOD_ASSIGN,   // %=

  BANG,         // !
  AS,           // as
  NAMED_NOT,    // not

  AMPER,        // &
  AND,          // &&
  NAMED_AND,    // and
  EXPLICIT_AND, // and!

  PIPE,         // |
  OR,           // ||
  NAMED_OR,     // or
  EXPLICIT_OR,  // or!

  LESS,         // <
  LESS_EQUAL,   // <=
  LEFT_SHIFT,   // <<

  GREATER,      // >
  RIGHT_SHIFT,  // >>
  GREAT_EQUAL,  // >=

  EQUALS,       // ==
  NOT_EQUALS,   // !=

  COMMA,        // ,
  DOT,          // .
  SPREAD,       // ...

  // ========================
  // SYMBOLS
  // ========================
  HASH,       // #
  LBRACE,     // {
  RBRACE,     // }
  LSQRBR,     // [
  RSQRBR,     // ]
  LPAREN,     // (
  RPAREN,     // )
  DOTS,       // :
  SEMICOLON,  // ;
  UNDERSCORE, // _

  // ========================
  // LITERALS
  // ========================
  STRING,
  CHAR,
  NUMBER,
  FLOAT,

  // ========================
  // SPECIALS
  // ========================
  IDENTIFIER,
  COMMENT,
  EOF,
  UNKNOWN
}

// ========================
// TYPES
// ========================
enum TokenKind {
  KEYWORD,
  OPERATOR,
  LITERAL,
  SYMBOL,
  SPECIAL
}

interface TokenDef {
  lexeme: string
  kind: TokenKind
}

export const TOKEN_DEFS: Record<TokenType, TokenDef> = {
  // ===== KEYWORDS
  [TokenType.CONST]:   { lexeme: "const",   kind: TokenKind.KEYWORD },
  [TokenType.STRUCT]:  { lexeme: "struct",  kind: TokenKind.KEYWORD },
  [TokenType.RETURN]:  { lexeme: "return",  kind: TokenKind.KEYWORD },
  [TokenType.IMPORT]:  { lexeme: "import",  kind: TokenKind.KEYWORD },
  [TokenType.TYPEDEF]: { lexeme: "typedef", kind: TokenKind.KEYWORD },
  [TokenType.ENUM]:    { lexeme: "enum",    kind: TokenKind.KEYWORD },
  [TokenType.FOR]:     { lexeme: "for",     kind: TokenKind.KEYWORD },
  [TokenType.WHILE]:   { lexeme: "while",   kind: TokenKind.KEYWORD },
  [TokenType.DO]:      { lexeme: "do",      kind: TokenKind.KEYWORD },
  [TokenType.BREAK]:   { lexeme: "break",   kind: TokenKind.KEYWORD },
  [TokenType.SKIP]:    { lexeme: "skip",    kind: TokenKind.KEYWORD },
  [TokenType.IF]:      { lexeme: "if",      kind: TokenKind.KEYWORD },
  [TokenType.ELSE]:    { lexeme: "else",    kind: TokenKind.KEYWORD },
  [TokenType.MATCH]:   { lexeme: "match",   kind: TokenKind.KEYWORD },
  [TokenType.PUB]:     { lexeme: "pub",     kind: TokenKind.KEYWORD },
  [TokenType.STATIC]:  { lexeme: "static",  kind: TokenKind.KEYWORD },
  [TokenType.EXTERN]:  { lexeme: "extern",  kind: TokenKind.KEYWORD },

  // ===== OPERATORS
  [TokenType.EQUAL]:        { lexeme: "=",   kind: TokenKind.OPERATOR },
  [TokenType.QUESTION]:     { lexeme: "?",   kind: TokenKind.OPERATOR },

  [TokenType.PLUS]:         { lexeme: "+",   kind: TokenKind.OPERATOR },
  [TokenType.INCREMENT]:    { lexeme: "++",  kind: TokenKind.OPERATOR },
  [TokenType.ADD_ASSIGN]:   { lexeme: "+=",  kind: TokenKind.OPERATOR },

  [TokenType.MINUS]:        { lexeme: "-",   kind: TokenKind.OPERATOR },
  [TokenType.DECREMENT]:    { lexeme: "--",  kind: TokenKind.OPERATOR },
  [TokenType.MINUS_ASSIGN]: { lexeme: "-=",  kind: TokenKind.OPERATOR },

  [TokenType.STAR]:         { lexeme: "*",   kind: TokenKind.OPERATOR },
  [TokenType.MULT_ASSIGN]:  { lexeme: "*=",  kind: TokenKind.OPERATOR },

  [TokenType.SLASH]:        { lexeme: "/",   kind: TokenKind.OPERATOR },
  [TokenType.DIV_ASSIGN]:   { lexeme: "/=",  kind: TokenKind.OPERATOR },

  [TokenType.PERCEN]:       { lexeme: "%",   kind: TokenKind.OPERATOR },
  [TokenType.MOD_ASSIGN]:   { lexeme: "%=",  kind: TokenKind.OPERATOR },

  [TokenType.BANG]:         { lexeme: "!",   kind: TokenKind.OPERATOR },
  [TokenType.AS]:           { lexeme: "as",  kind: TokenKind.OPERATOR },
  [TokenType.NAMED_NOT]:    { lexeme: "not", kind: TokenKind.OPERATOR },

  [TokenType.AMPER]:        { lexeme: "&",   kind: TokenKind.OPERATOR },
  [TokenType.AND]:          { lexeme: "&&",  kind: TokenKind.OPERATOR },
  [TokenType.NAMED_AND]:    { lexeme: "and", kind: TokenKind.OPERATOR },
  [TokenType.EXPLICIT_AND]: { lexeme: "and!",kind: TokenKind.OPERATOR },

  [TokenType.PIPE]:         { lexeme: "|",   kind: TokenKind.OPERATOR },
  [TokenType.OR]:           { lexeme: "||",  kind: TokenKind.OPERATOR },
  [TokenType.NAMED_OR]:     { lexeme: "or",  kind: TokenKind.OPERATOR },
  [TokenType.EXPLICIT_OR]:  { lexeme: "or!", kind: TokenKind.OPERATOR },

  [TokenType.LESS]:         { lexeme: "<",   kind: TokenKind.OPERATOR },
  [TokenType.LESS_EQUAL]:   { lexeme: "<=",  kind: TokenKind.OPERATOR },
  [TokenType.LEFT_SHIFT]:   { lexeme: "<<",  kind: TokenKind.OPERATOR },

  [TokenType.GREATER]:      { lexeme: ">",   kind: TokenKind.OPERATOR },
  [TokenType.RIGHT_SHIFT]:  { lexeme: ">>",  kind: TokenKind.OPERATOR },
  [TokenType.GREAT_EQUAL]:  { lexeme: ">=",  kind: TokenKind.OPERATOR },

  [TokenType.EQUALS]:       { lexeme: "==",  kind: TokenKind.OPERATOR },
  [TokenType.NOT_EQUALS]:   { lexeme: "!=",  kind: TokenKind.OPERATOR },

  [TokenType.COMMA]:        { lexeme: ",",   kind: TokenKind.OPERATOR },
  [TokenType.DOT]:          { lexeme: ".",   kind: TokenKind.OPERATOR },
  [TokenType.SPREAD]:       { lexeme: "...", kind: TokenKind.OPERATOR },

  // ===== SYMBOLS
  [TokenType.HASH]:       { lexeme: "#", kind: TokenKind.SYMBOL },
  [TokenType.LBRACE]:     { lexeme: "{", kind: TokenKind.SYMBOL },
  [TokenType.RBRACE]:     { lexeme: "}", kind: TokenKind.SYMBOL },
  [TokenType.LSQRBR]:     { lexeme: "[", kind: TokenKind.SYMBOL },
  [TokenType.RSQRBR]:     { lexeme: "]", kind: TokenKind.SYMBOL },
  [TokenType.LPAREN]:     { lexeme: "(", kind: TokenKind.SYMBOL },
  [TokenType.RPAREN]:     { lexeme: ")", kind: TokenKind.SYMBOL },
  [TokenType.DOTS]:       { lexeme: ":", kind: TokenKind.SYMBOL },
  [TokenType.SEMICOLON]:  { lexeme: ";", kind: TokenKind.SYMBOL },
  [TokenType.UNDERSCORE]: { lexeme: "_", kind: TokenKind.SYMBOL },

  // ===== LITERALS
  [TokenType.STRING]: { lexeme: "STRING", kind: TokenKind.LITERAL },
  [TokenType.CHAR]:   { lexeme: "CHAR",   kind: TokenKind.LITERAL },
  [TokenType.NUMBER]: { lexeme: "NUMBER", kind: TokenKind.LITERAL },
  [TokenType.FLOAT]:  { lexeme: "FLOAT",  kind: TokenKind.LITERAL },

  // ===== SPECIALS
  [TokenType.IDENTIFIER]: { lexeme: "IDENTIFIER", kind: TokenKind.SPECIAL },
  [TokenType.COMMENT]:    { lexeme: "COMMENT",    kind: TokenKind.SPECIAL },
  [TokenType.EOF]:        { lexeme: "EOF",        kind: TokenKind.SPECIAL },
  [TokenType.UNKNOWN]:    { lexeme: "UNKNOWN",    kind: TokenKind.SPECIAL },
}

export const KEYWORDS: Map<string, TokenType> = new Map([
  ["const",   TokenType.CONST],
  ["struct",  TokenType.STRUCT],
  ["return",  TokenType.RETURN],
  ["import",  TokenType.IMPORT],
  ["typedef", TokenType.TYPEDEF],
  ["enum",    TokenType.ENUM],
  ["for",     TokenType.FOR],
  ["while",   TokenType.WHILE],
  ["do",      TokenType.DO],
  ["break",   TokenType.BREAK],
  ["skip",    TokenType.SKIP],
  ["if",      TokenType.IF],
  ["else",    TokenType.ELSE],
  ["match",   TokenType.MATCH],
  ["pub",     TokenType.PUB],
  ["static",  TokenType.STATIC],
  ["extern",  TokenType.EXTERN],
  ["and",     TokenType.NAMED_AND],
  ["and!",    TokenType.EXPLICIT_AND],
  ["or",      TokenType.NAMED_OR],
  ["or!",     TokenType.EXPLICIT_OR],
  ["not",     TokenType.NAMED_NOT],
  ["as",      TokenType.AS],
])

export class Token {
  type: TokenType
  content: string

  public constructor(type: TokenType, content: string) {
    this.type = type
    this.content = content
  }

  // ===== SOURCE OF TRUTH

  private get Def(): TokenDef {
    return TOKEN_DEFS[this.type]
  }

  // ===== BASIC CHECKS

  public is(maybe: TokenType): Maybe<true> {
    return this.type === maybe || undefined
  }

  // ===== KIND CHECKS

  public isKeyword(): boolean {
    return this.Def.kind === TokenKind.KEYWORD
  }

  public isLiteral(): boolean {
    return this.Def.kind === TokenKind.LITERAL
  }

  public isOperator(): this is Operator {
    return this.Def.kind === TokenKind.OPERATOR
  }

  public isSymbol(): boolean {
    return this.Def.kind === TokenKind.SYMBOL
  }

  public isSpecial(): boolean {
    return this.Def.kind === TokenKind.SPECIAL
  }

  public isEOF(): this is Token {
    return this.type === TokenType.EOF
  }
}

// ======================================
// OPERATOR
// ======================================

export class Operator extends Token {
  public get Prec(): number {
    switch (this.type) {
      case TokenType.DOT:
        return 0

      case TokenType.STAR:
      case TokenType.SLASH:
      case TokenType.PERCEN:
        return 1

      case TokenType.PLUS:
      case TokenType.MINUS:
        return 2

      case TokenType.LEFT_SHIFT:
      case TokenType.RIGHT_SHIFT:
        return 2

      case TokenType.LESS:
      case TokenType.GREATER:
      case TokenType.LESS_EQUAL:
      case TokenType.GREAT_EQUAL:
        return 3

      case TokenType.EQUALS:
      case TokenType.NOT_EQUALS:
        return 4

      case TokenType.AND:
      case TokenType.NAMED_AND:
      case TokenType.EXPLICIT_AND:
        return 5

      case TokenType.OR:
      case TokenType.NAMED_OR:
      case TokenType.EXPLICIT_OR:
        return 6

      case TokenType.EQUAL:
      case TokenType.ADD_ASSIGN:
      case TokenType.MINUS_ASSIGN:
      case TokenType.MULT_ASSIGN:
      case TokenType.DIV_ASSIGN:
      case TokenType.MOD_ASSIGN:
        return 7

      case TokenType.AS:
        return 9
    }

    // Operadores sin precedencia definida (unarios, etc.)
    return -1
  }

  public get Assoc(): "left" | "right" {
    switch (this.type) {
      case TokenType.EQUAL:
      case TokenType.ADD_ASSIGN:
      case TokenType.MINUS_ASSIGN:
      case TokenType.MULT_ASSIGN:
      case TokenType.DIV_ASSIGN:
      case TokenType.MOD_ASSIGN:
        return "right"
    }

    return "left"
  }
}