import * as Chunk from '@effect/data/Chunk'
import * as Predicate from '@effect/data/Predicate'

declare const nss: Chunk.Chunk<number | string>

// -------------------------------------------------------------------------------------
// every
// -------------------------------------------------------------------------------------

if (Chunk.every(nss, Predicate.isString)) {
  nss // $ExpectType Chunk<string>
}

if (Chunk.every(Predicate.isString)(nss)) {
  nss // $ExpectType Chunk<string>
}

// -------------------------------------------------------------------------------------
// partition
// -------------------------------------------------------------------------------------

// $ExpectType [Chunk<number>, Chunk<string>]
Chunk.partition(nss, Predicate.isString)

// $ExpectType [Chunk<number>, Chunk<string>]
nss.pipe(Chunk.partition(Predicate.isString))