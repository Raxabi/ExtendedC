import { assertEquals } from "@std/assert"
import Lexer from "@frontend/lexer.ts"

Deno.test("Lexer should tokenize a simple expression", () => {
  const lexer = Lexer.init("tests/main.ec")
  assertEquals(lexer.current, '/')
})