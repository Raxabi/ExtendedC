import type { Maybe } from "@/typings.ts"
import { Position } from "@/position.ts"

export interface Collectable<T> {
  collect(): T[]
}

export interface Reader<T, C = T> {
  current: T

  nextN(n: number): Maybe<T>
  
  next(): Maybe<T>

  ahead(): Maybe<T>

  check(maybe: C): boolean

  match(maybe: C): Maybe<T>

  get Position(): Position

  get EOF(): boolean
}
