/**
 * @since 1.0.0
 */

import * as Equal from "@fp-ts/data/Equal"

const TypeId: unique symbol = Symbol.for("@fp-ts/data/DoublyLinkedList") as TypeId

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * @since 1.0.0
 * @category model
 */
export interface DoublyLinkedList<A> extends Iterable<A>, Equal.Equal {
  readonly _id: TypeId
  readonly _A: (_: never) => A

  /** @internal */
  head: LinkedListNode<A> | undefined
  /** @internal */
  tail: LinkedListNode<A> | undefined
}

function variance<A, B>(_: A): B {
  return _ as unknown as B
}

/** @internal */
class DoublyLinkedListImpl<A> implements DoublyLinkedList<A> {
  readonly _id: TypeId = TypeId
  readonly _A: (_: never) => A = variance

  head: LinkedListNode<A> | undefined = undefined
  tail: LinkedListNode<A> | undefined = undefined
  _length = 0;

  [Equal.symbolHash]() {
    return Equal.hashRandom(this)
  }

  [Equal.symbolEqual](that: unknown) {
    return this === that
  }

  [Symbol.iterator](): Iterator<A> {
    let done = false
    let head: LinkedListNode<A> | undefined = this.head
    return {
      next() {
        if (done) {
          return this.return!()
        }
        if (head == null) {
          done = true
          return this.return!()
        }
        const value = head.value
        head = head.right
        return { done, value }
      },
      return(value?: unknown) {
        if (!done) {
          done = true
        }
        return { done: true, value }
      }
    }
  }
}

/** @internal */
class LinkedListNode<T> {
  removed = false
  left: LinkedListNode<T> | undefined = undefined
  right: LinkedListNode<T> | undefined = undefined
  constructor(readonly value: T) {}
}

/**
 * Creates an empty `DoublyLinkedList`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const empty = <A>(): DoublyLinkedList<A> => new DoublyLinkedListImpl()

/**
 * Creates a new `DoublyLinkedList` from an `Iterable`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const from = <A>(iterable: Iterable<A>): DoublyLinkedList<A> => {
  const list: DoublyLinkedList<A> = new DoublyLinkedListImpl()
  for (const element of iterable) {
    append<A>(element)(list)
  }
  return list
}

/**
 * Creates a new `DoublyLinkedList` from the specified elements.
 *
 * @since 1.0.0
 * @category constructors
 */
export const make = <A>(...elements: ReadonlyArray<A>): DoublyLinkedList<A> => from(elements)

/**
 * Returns `true` if the list contains zero elements, `false`, otherwise.
 *
 * @since 1.0.0
 * @category getters
 */
export const isEmpty = <A>(self: DoublyLinkedList<A>): boolean => length(self) === 0

/**
 * Returns the length of the list.
 *
 * @since 1.0.0
 * @category getters
 */
export const length = <A>(self: DoublyLinkedList<A>): number =>
  (self as DoublyLinkedListImpl<A>)._length

/**
 * Returns the last element of the list, if it exists.
 *
 * @since 1.0.0
 * @category getters
 */
export const tail = <A>(self: DoublyLinkedList<A>): A | undefined =>
  self.tail === undefined ? undefined : self.tail.value

/**
 * Returns the first element of the list, if it exists.
 *
 * @since 1.0.0
 * @category getters
 */
export const head = <A>(self: DoublyLinkedList<A>): A | undefined =>
  self.head === undefined ? undefined : self.head.value

/**
 * Executes the specified function `f` for each element in the list.
 *
 * @since 1.0.0
 * @category traversing
 */
export const forEach = <A>(f: (element: A) => void) =>
  (self: DoublyLinkedList<A>): void => {
    let current = self.head
    while (current !== undefined) {
      f(current.value)
      current = current.right
    }
  }

/**
 * Removes all elements from the doubly-linked list.
 *
 * @since 1.0.0
 * @category mutations
 */
export const reset = <A>(self: DoublyLinkedList<A>): DoublyLinkedList<A> => {
  ;(self as DoublyLinkedListImpl<A>)._length = 0
  self.head = undefined
  self.tail = undefined
  return self
}

/**
 * Appends the specified value to the end of the list.
 *
 * @since 1.0.0
 * @category mutations
 */
export const append = <A>(value: A) =>
  (self: DoublyLinkedList<A>): DoublyLinkedList<A> => {
    const node = new LinkedListNode(value)
    if ((self as DoublyLinkedListImpl<A>)._length === 0) {
      self.head = node
    }
    if (self.tail === undefined) {
      self.tail = node
    } else {
      self.tail.right = node
      node.left = self.tail
      self.tail = node
    }
    ;(self as DoublyLinkedListImpl<A>)._length += 1
    return self
  }

/**
 * Removes the first value from the list and returns it, if it exists.
 *
 * @since 0.0.1
 * @category mutations
 */
export const shift = <A>(self: DoublyLinkedList<A>): A | undefined => {
  const head = self.head
  if (head !== undefined) {
    remove(head)(self)
    return head.value
  }
  return undefined
}

/**
 * Removes the last value from the list and returns it, if it exists.
 *
 * @since 0.0.1
 * @category mutations
 */
export const pop = <A>(self: DoublyLinkedList<A>): A | undefined => {
  const tail = self.tail
  if (tail !== undefined) {
    remove(tail)(self)
    return tail.value
  }
  return undefined
}

function remove<A>(node: LinkedListNode<A>) {
  return (self: DoublyLinkedList<A>): void => {
    if (node.removed) {
      return
    }
    node.removed = true
    if (node.left !== undefined && node.right !== undefined) {
      node.left.right = node.right
      node.right.left = node.left
    } else if (node.left !== undefined) {
      self.tail = node.left
      node.left.right = undefined
    } else if (node.right !== undefined) {
      self.head = node.right
      node.right.left = undefined
    } else {
      self.tail = undefined
      self.head = undefined
    }
    if ((self as DoublyLinkedListImpl<A>)._length > 0) {
      ;(self as DoublyLinkedListImpl<A>)._length -= 1
    }
  }
}
