import io;
import os;

/**
 * A simple lexer for reading characters from a file.
 */
pub struct Lexer {
  const* File file,
  pub bool isEOF,
  pub const* Position pos,
  char current,
}

/**
 * A simple parser that uses a lexer to read tokens from a file.
 */
pub struct Parser {
  const Token current, 
  const* Lexer lexer,
  pub const* Position pos,
}

/**
 * Represents a position in the source code, including the index, column, and line number.
 */
pub struct Position {
  uint idx, // index in the source code
  uint col, // position in the current line
  uint line, // line number in the source code
}

pub enum TokenType {
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

/**
 * A token produced by the lexer.
 */
pub struct Token {
  pub const String content
}

/**
 * Reads the next character from the file and updates the current character and EOF status.
 * @param n The number of characters to read ahead (default is 0, meaning the next character).
 * @returns The next character read from the file.
 */
pub const char (const* Lexer l) next_n(usize n) {
  const char next = l.file.read_char(n);
  l.current = next;
  l.isEOF = next == EOF;

  if (!l.isEOF) {
    l.pos.idx += n;
    l.pos.col += n;
  }

  return next;
}

/**
 * Reads the next character from the file and updates the current character and EOF status
 * @returns The next character read from the file
 */
pub const char (const* Lexer l) next() {
  return l.next_n(0);
}

/**
 * Peeks at the next character in the file without advancing the lexer
 * @returns The next character in the file without consuming it
 */
pub const char (const* Lexer l) ahead() {
  return l.file.peek();
}

/**
 * Checks if the next character matches the given character without advancing the lexer
 * @param c The character to check against
 * @returns True if the next character matches, false otherwise
 */
pub const bool (const* Lexer l) check(char c) {
  return l.ahead() == c;
}

/* ===== LEXER FUNCTIONS ===== */

/**
 * Checks if the current character is an end-of-line character (newline or carriage return)
 * @returns `true` if the current character is an end-of-line character, `false` otherwise
 */
const bool (const* Lexer l) is_eol() {
  return l.current == '\n' || l.current == '\r';
}

void (const* Lexer l) skip_eol() {

}

/**
 * Checks if the current character is a whitespace character (space or tab)
 * @returns `true` if the current character is a whitespace character, `false` otherwise
 */
const bool (const* Lexer l) is_space() {
  return l.current == ' ' || l.current == '\t';
}

/**
 * Checks if the current character is an alphabetic character (a-z or A-Z)
 * @returns `true` if the current character is an alphabetic character, `false` otherwise
 */
const bool (const* Lexer l) is_alpha() {
  return (l.current >= 'a' && l.current <= 'z') || (l.current >= 'A' && l.current <= 'Z');
}

/**
 * Checks if the current character is a numeric character (0-9)
 * @returns `true` if the current character is a numeric character, `false` otherwise
 */
const bool (const* Lexer l) is_numeric() {
  return l.current >= '0' && l.current <= '9';
}

const* const Token (const* Lexer l) scan_single_char() {
  match (l.current) {
    '>':  return l.scanGreater()
    '<':  return l.scanLess()
    '&':  return l.scanAmpersand()
    '|':  return l.scanPipe()
    '+':  return l.scanPlus()
    '-':  return l.scanMinus()
    '=':  return l.scanEqual()
    '!':  return l.scanBang()
    '/':  return l.scanSlash()
    '.':  return l.scanDot()
    '"':  return l.scanString()
    '\'': return l.scanChar()

    '{':  return Token{type: TokenType.LBRACE, content: "{"}
    '}':  return Token{type: TokenType.RBRACE, content: "}"}
    '(':  return Token{type: TokenType.LPAREN, content: "("}
    ')':  return Token{type: TokenType.RPAREN, content: ")"}
    '[':  return Token{type: TokenType.LSQRBR, content: "["}
    ']':  return Token{type: TokenType.RSQRBR, content: "]"}
    ',':  return Token{type: TokenType.COMMA, content: ","}
    ';':  return Token{type: TokenType.SEMICOLON, content: ";"}
    '?':  return Token{type: TokenType.QUESTION, content: "?"}
    '#':  return Token{type: TokenType.HASH, content: "#"}
  }

  // Ignore spaces and newlines by rescanning
  if (l.is_space() || l.is_eol())
    return l.scan()

  return Token{type: TokenType.UNKNOWN, content: l.current}
}

/**
 * Scans the next token from the lexer
 * @param l The lexer to scan from
 * @returns A pointer to the next token scanned from the lexer
 */
pub const* const Token (const* Lexer l) scan() {
  if (l.isEOF)
    return Token{ content: "\0" };

  while (l.is_space())
    l.next();

  if (l.is_eol())
    l.skip_eol();

  if (l.is_alpha(l.current))
    return l.scanIdentifierOrKeyword()

  if (l.is_numeric(l.current))
    return l.scanNumber()

  return l.scanSingleChar()
}

/**
 * Scans all tokens from the lexer until EOF and returns them as an array
 * @param l The lexer to scan from
 * @returns An array of pointers to tokens scanned from the lexer
 */
pub const[] const* const Token (const* Lexer l) scan_all() {
  []const* const Token tokens = [];

  // scan tokens until EOF
  while (!l.isEOF)
    tokens.push(l.scan());

  return tokens;
}

/**
 * Creates a new lexer for the given file
 * @param file The file to read from
 * @returns A new lexer instance
 */
pub const* Lexer l_new(const* File file) {
  bool isEOF = current == EOF;
  const char current = '\0';
  const* Position pos = &Position{ idx: 0, col: 0, line: 1 };
  return &Lexer{
    file,
    isEOF,
    pos
    current,
  };
}

int main(const[] const String args) {
  const* File file = f_open(args[0]);
  const* Lexer lexer = l_new(file);
  const[] const* const Token tokens = lexer.scan_all();

  return 0;
}
