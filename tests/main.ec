/**
 * A simple lexer for reading characters from a file.
 */
pub struct Lexer {
  const *File file,
  char current,
  bool isEOF
}

/**
 * Reads the next character from the file and updates the current character and EOF status.
 * @param n The number of characters to read ahead (default is 0, meaning the next character).
 * @returns The next character read from the file.
 */
const char (const *Lexer p) next_n(usize n) {
  const char next = p.file.read_char(n);
  p.current = next;
  p.isEOF = next == EOF;

  return next;
}

/**
 * Reads the next character from the file and updates the current character and EOF status.
 * @returns The next character read from the file.
 */
const char (const *Lexer p) next() {
  return p.next_n(0);
}

const char (const *Lexer p) ahead() {
  return p.file.peek();
}

bool (const *Lexer p) check(char c) {
  return p.ahead() == c;
}

const char (const *Lexer p) match(char c) {
  if (p.check(c))
    return p.next_n(n);

  return '\0';
}

/**
 * Creates a new lexer for the given file.
 * @param file The file to read from.
 * @returns A new lexer instance.
 */
pub const Lexer l_new(const *File file) {
  const char current = NULL_CHAR;
  bool isEOF = current == EOF;
  return Lexer{
    file,
    current,
    isEOF
  };
}

int main() {
  int x = 22; // integer
  const int y = 22; // constant integer

  *int p = &x; // pointer to integer
  *p = 33; // modify x through the pointer
  p = &y; // point to y

  *const int p2 = &y; // pointer to constant integer
  *p2 = 33; // error: cannot modify y through the pointer
  p2 = &x; // the pointer itself can be modified to point to another integer

  const *int p3 = &x; // constant pointer to integer
  *p3 = 33; // modify x through the pointer
  p3 = &y; // error: cannot modify the pointer itself to point to another integer

  const *const int p4 = &y; // constant pointer to constant integer
  *p4 = 33; // error: cannot modify y through the pointer
  p4 = &x; // error: cannot modify the pointer itself to point to another

  return 0;
}
