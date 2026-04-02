import io;

typedef allocator  *void (const *Lexer);

/**
 * A simple lexer for reading characters from a file.
 */
pub struct Lexer {
  const *File file,
  pub bool isEOF,
  char current,
}

/**
 * Reads the next character from the file and updates the current character and EOF status.
 * @param n The number of characters to read ahead (default is 0, meaning the next character).
 * @returns The next character read from the file.
 */
pub char (const *Lexer p) next_n(usize n) {
  const char next = p.file.read_char(n);
  p.current = next;
  p.isEOF = next == EOF;

  return next;
}

/**
 * Reads the next character from the file and updates the current character and EOF status.
 * @returns The next character read from the file.
 */
pub char (const *Lexer p) next() {
  return p.next_n(0);
}

/**
 * Peeks at the next character in the file without advancing the lexer.
 * @returns The next character in the file without consuming it.
 */
pub char (const *Lexer p) ahead() {
  return p.file.peek();
}

/**
 * Checks if the next character matches the given character without advancing the lexer.
 * @param c The character to check against.
 * @returns True if the next character matches, false otherwise.
 */
pub bool (const *Lexer p) check(char c) {
  return p.ahead() == c;
}

/**
 * Checks if the next character matches the given character and advances the lexer if it does.
 * @param c The character to match.
 * @returns The matched character if it matches, or '\0' if it does not match.
 */
pub char (const *Lexer p) match(char c) {
  if (p.check(c))
    return p.next_n(n);

  return '\0';
}

/**
 * Creates a new lexer for the given file.
 * @param file The file to read from.
 * @returns A new lexer instance.
 */
pub *Lexer l_new(const *File file) {
  const char current = '\0';
  bool isEOF = current == EOF;
  return &Lexer{
    file,
    current,
    isEOF
  };
}

int main(const String[] args) {
  // Variables
  int x = 22; // integer
  const int y = 22; // constant integer

  // Pointers with variables
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

  const *Lexer lexer = l_new(args[0]); // create a lexer for the first file argument
  io.println("Current character: " + lexer.next()); // read and print the next character from the file

  // Pointers with arrays
  []int arr = [1, 2, 3];
  arr[0] = 10; // modify the first element of the array

  const []int const_arr = [1, 2, 3];
  const_arr[0] = 10; // error: cannot modify elements of a constant

  *[]int arr_ptr = &arr; // pointer to array of integers
  arr_ptr[0] = 10; // modify the first element of the array through the pointer
  arr_ptr = &const_arr; // the pointer itself can be modified to point to another array

  const *[]int c_prt_arr = &arr; // constaint pointer to array of integers
  c_prt_arr[0] = 10; // modify the first element of the array through the pointer
  c_prt_arr = &const_arr; // error: cannot modify the pointer to point to a different array

  *const []int const_arr_ptr = &const_arr; // pointer to constant array of integers
  const_arr_ptr[0] = 10; // error: cannot modify elements of the array through the pointer
  const_arr_ptr = &arr; // the pointer itself can be modified to point to another array

  const *const []int const_ptr_const_arr = &const_arr; // constant pointer to constant array of integers
  const_ptr_const_arr[0] = 10; // error: cannot modify elements of the array through the pointer
  const_ptr_const_arr = &arr; // error: cannot modify the pointer itself to point to another array

  []*int ptr_arr = [&x, &y]; // array of pointers to integers
  ptr_arr[0] = &x; // modify the first pointer in the array

  const []*int const_ptr_arr = [&x, &y]; // array of constant pointers to integers
  const_ptr_arr[0] = &x; // error: cannot modify the pointers in the array

  const []*const int const_ptr_const_arr = [&x, &y]; // array of constant pointers to constant integers
  const_ptr_const_arr[0] = &x; // error: cannot modify the pointers in the array

  const *[]const *const int const_ptr_const_arr2 = &const_ptr_const_arr; // at this point I dont know how to name this, but basically its "a constant pointer to an array of constant pointers to constant integers"

  const *[]const *const *int const_ptr_const_arr3 = &const_ptr_const_arr2; // and this is "a constant pointer to an array of constant pointers to constant pointers to constant integers"

  return 0;
}
