import * as _ from "@fp-ts/data/Either"
import { flow, identity, pipe } from "@fp-ts/data/Function"
import * as Number from "@fp-ts/data/Number"
import * as O from "@fp-ts/data/Option"
import * as String from "@fp-ts/data/String"
import { deepStrictEqual, double } from "@fp-ts/data/test/util"

describe.concurrent("Either", () => {
  it("instances and derived exports", () => {
    expect(_.Invariant).exist
    expect(_.imap).exist
    expect(_.tupled).exist
    expect(_.bindTo).exist

    expect(_.Covariant).exist
    expect(_.map).exist
    expect(_.let).exist
    expect(_.flap).exist
    expect(_.as).exist
    expect(_.asUnit).exist

    expect(_.Bicovariant).exist
    expect(_.bimap).exist
    expect(_.mapLeft).exist

    expect(_.Of).exist
    expect(_.of).exist
    expect(_.unit).exist
    expect(_.Do).exist

    expect(_.Pointed).exist

    expect(_.FlatMap).exist
    expect(_.flatMap).exist
    expect(_.flatten).exist
    expect(_.andThen).exist
    expect(_.composeKleisliArrow).exist

    expect(_.Chainable).exist
    expect(_.bind).exist
    expect(_.tap).exist
    expect(_.andThenDiscard).exist

    expect(_.Monad).exist

    expect(_.NonEmptyProduct).exist
    expect(_.product).exist

    expect(_.Product).exist
    expect(_.productAll).exist
    expect(_.tuple).exist
    expect(_.struct).exist

    expect(_.NonEmptyApplicative).exist
    expect(_.lift2).exist
    expect(_.lift3).exist
    expect(_.ap).exist
    expect(_.andThenDiscard).exist
    expect(_.andThen).exist

    expect(_.Applicative).exist
    expect(_.getFirstErrorMonoid).exist

    expect(_.NonEmptyCoproduct).exist
    expect(_.firstSuccessOf).exist

    expect(_.NonEmptyAlternative).exist

    expect(_.Foldable).exist

    expect(_.Traversable).exist
    expect(_.traverse).exist
    expect(_.sequence).exist
    expect(_.traverseTap).exist
  })

  it("isEither", () => {
    deepStrictEqual(pipe(_.right(1), _.isEither), true)
    deepStrictEqual(pipe(_.left("e"), _.isEither), true)
    deepStrictEqual(pipe(O.some(1), _.isEither), false)
  })

  it("orElseFail", () => {
    deepStrictEqual(pipe(_.right(1), _.orElseFail("e2")), _.right(1))
    deepStrictEqual(pipe(_.left("e1"), _.orElseFail("e2")), _.left("e2"))
  })

  it("orElseSucceed", () => {
    deepStrictEqual(pipe(_.right(1), _.orElseSucceed(2)), _.right(1))
    deepStrictEqual(pipe(_.left("e"), _.orElseSucceed(2)), _.right(2))
  })

  it("reduce", () => {
    deepStrictEqual(pipe(_.right("bar"), _.Foldable.reduce("foo", (b, a) => b + a)), "foobar")
    deepStrictEqual(pipe(_.left("bar"), _.Foldable.reduce("foo", (b, a) => b + a)), "foo")
  })

  it("getRight", () => {
    deepStrictEqual(pipe(_.right(1), _.getRight), O.some(1))
    deepStrictEqual(pipe(_.left("a"), _.getRight), O.none)
  })

  it("getLeft", () => {
    deepStrictEqual(pipe(_.right(1), _.getLeft), O.none)
    deepStrictEqual(pipe(_.left("e"), _.getLeft), O.some("e"))
  })

  it("getOrNull", () => {
    deepStrictEqual(pipe(_.right(1), _.getOrNull), 1)
    deepStrictEqual(pipe(_.left("a"), _.getOrNull), null)
  })

  it("getOrUndefined", () => {
    deepStrictEqual(pipe(_.right(1), _.getOrUndefined), 1)
    deepStrictEqual(pipe(_.left("a"), _.getOrUndefined), undefined)
  })

  it("compactOrElse", () => {
    deepStrictEqual(pipe(_.right(O.some(1)), _.compactOrElse(() => "e2")), _.right(1))
    deepStrictEqual(pipe(_.right(O.none), _.compactOrElse("e2")), _.left("e2"))
    deepStrictEqual(pipe(_.left("e1"), _.compactOrElse("e2")), _.left("e1"))
  })

  it("unsafeTap", () => {
    const log: Array<number> = []
    pipe(_.right(1), _.unsafeTap((e) => log.push(e)))
    pipe(_.left("e"), _.unsafeTap((e) => log.push(e)))
    deepStrictEqual(log, [1])
  })

  it("tapError", () => {
    deepStrictEqual(pipe(_.right(1), _.tapError(() => _.right(2))), _.right(1))
    deepStrictEqual(pipe(_.left("a"), _.tapError(() => _.right(2))), _.left("a"))
    deepStrictEqual(pipe(_.left("a"), _.tapError(() => _.left("b"))), _.left("b"))
  })

  it("unsafeTapError", () => {
    const log: Array<string> = []
    pipe(_.right(1), _.unsafeTapError((e) => log.push(e)))
    pipe(_.left("e"), _.unsafeTapError((e) => log.push(e)))
    deepStrictEqual(log, ["e"])
  })

  it("getOrThrow", () => {
    expect(pipe(_.right(1), _.getOrThrow((e: string) => new Error(e)))).toEqual(1)
    expect(() => pipe(_.left("e"), _.getOrThrow((e: string) => new Error(e)))).toThrow(
      new Error("e")
    )
  })

  it("andThenDiscard", () => {
    deepStrictEqual(pipe(_.right(1), _.andThenDiscard(_.right("a"))), _.right(1))
    deepStrictEqual(pipe(_.right(1), _.andThenDiscard(_.left(true))), _.left(true))
    deepStrictEqual(pipe(_.left(1), _.andThenDiscard(_.right("a"))), _.left(1))
    deepStrictEqual(pipe(_.left(1), _.andThenDiscard(_.left(true))), _.left(1))
  })

  it("andThen", () => {
    deepStrictEqual(pipe(_.right(1), _.andThen(_.right("a"))), _.right("a"))
    deepStrictEqual(pipe(_.right(1), _.andThen(_.left(true))), _.left(true))
    deepStrictEqual(pipe(_.left(1), _.andThen(_.right("a"))), _.left(1))
    deepStrictEqual(pipe(_.left(1), _.andThen(_.left(true))), _.left(1))
  })

  it("orElse", () => {
    deepStrictEqual(pipe(_.right(1), _.orElse(_.right(2))), _.right(1))
    deepStrictEqual(pipe(_.right(1), _.orElse(_.left("b"))), _.right(1))
    deepStrictEqual(pipe(_.left("a"), _.orElse(_.right(2))), _.right(2))
    deepStrictEqual(pipe(_.left("a"), _.orElse(_.left("b"))), _.left("b"))
  })

  it("orElseEither", () => {
    expect(pipe(_.right(1), _.orElseEither(_.right(2)))).toEqual(_.right(_.left(1)))
    expect(pipe(_.right(1), _.orElseEither(_.left("b")))).toEqual(_.right(_.left(1)))
    expect(pipe(_.left("a"), _.orElseEither(_.right(2)))).toEqual(_.right(_.right(2)))
    expect(pipe(_.left("a"), _.orElseEither(_.left("b")))).toEqual(_.left("b"))
  })

  it("map", () => {
    const f = _.map(String.size)
    deepStrictEqual(pipe(_.right("abc"), f), _.right(3))
    deepStrictEqual(pipe(_.left("s"), f), _.left("s"))
  })

  it("flatMap", () => {
    const f = _.flatMap<string, string, number>(flow(String.size, _.right))
    deepStrictEqual(pipe(_.right("abc"), f), _.right(3))
    deepStrictEqual(pipe(_.left("maError"), f), _.left("maError"))
  })

  it("bimap", () => {
    const f = _.bimap(String.size, (n: number) => n > 2)
    deepStrictEqual(pipe(_.right(1), f), _.right(false))
  })

  it("mapLeft", () => {
    const f = _.mapLeft(double)
    deepStrictEqual(pipe(_.right("a"), f), _.right("a"))
    deepStrictEqual(pipe(_.left(1), f), _.left(2))
  })

  it("traverse", () => {
    const traverse = _.traverse(O.Applicative)((
      n: number
    ) => (n >= 2 ? O.some(n) : O.none))
    deepStrictEqual(pipe(_.left("a"), traverse), O.some(_.left("a")))
    deepStrictEqual(pipe(_.right(1), traverse), O.none)
    deepStrictEqual(pipe(_.right(3), traverse), O.some(_.right(3)))
  })

  it("sequence", () => {
    const sequence = _.sequence(O.Applicative)
    deepStrictEqual(sequence(_.right(O.some(1))), O.some(_.right(1)))
    deepStrictEqual(sequence(_.left("a")), O.some(_.left("a")))
    deepStrictEqual(sequence(_.right(O.none)), O.none)
  })

  it("match", () => {
    const f = (s: string) => `left${s.length}`
    const g = (s: string) => `right${s.length}`
    const match = _.match(f, g)
    deepStrictEqual(match(_.left("abc")), "left3")
    deepStrictEqual(match(_.right("abc")), "right3")
  })

  it("getOrElse", () => {
    deepStrictEqual(pipe(_.right(12), _.getOrElse(17)), 12)
    deepStrictEqual(pipe(_.left("a"), _.getOrElse(17)), 17)
  })

  it("elem", () => {
    deepStrictEqual(pipe(_.left("a"), _.elem(2)), false)
    deepStrictEqual(pipe(_.right(2), _.elem(2)), true)
    deepStrictEqual(pipe(_.right(2), _.elem(1)), false)
  })

  it("filterOrElse", () => {
    const predicate = (n: number) => n > 10
    deepStrictEqual(pipe(_.right(12), _.filterOrElse(predicate, -1)), _.right(12))
    deepStrictEqual(pipe(_.right(7), _.filterOrElse(predicate, -1)), _.left(-1))
    deepStrictEqual(pipe(_.left(12), _.filterOrElse(predicate, -1)), _.left(12))
  })

  it("isLeft", () => {
    deepStrictEqual(_.isLeft(_.right(1)), false)
    deepStrictEqual(_.isLeft(_.left(1)), true)
  })

  it("isRight", () => {
    deepStrictEqual(_.isRight(_.right(1)), true)
    deepStrictEqual(_.isRight(_.left(1)), false)
  })

  it("catchAll", () => {
    deepStrictEqual(pipe(_.right(1), _.catchAll(() => _.right(2))), _.right(1))
    deepStrictEqual(pipe(_.right(1), _.catchAll(() => _.left("foo"))), _.right(1))
    deepStrictEqual(pipe(_.left("a"), _.catchAll(() => _.right(1))), _.right(1))
    deepStrictEqual(pipe(_.left("a"), _.catchAll(() => _.left("b"))), _.left("b"))
  })

  it("swap", () => {
    deepStrictEqual(_.reverse(_.right("a")), _.left("a"))
    deepStrictEqual(_.reverse(_.left("b")), _.right("b"))
  })

  it("fromPredicateOrElse", () => {
    const f = _.liftPredicateOrElse((n: number) => n >= 2, "e")
    deepStrictEqual(f(3), _.right(3))
    deepStrictEqual(f(1), _.left("e"))
  })

  it("fromNullableOrElse", () => {
    deepStrictEqual(_.fromNullableOrElse("default")(null), _.left("default"))
    deepStrictEqual(_.fromNullableOrElse("default")(undefined), _.left("default"))
    deepStrictEqual(_.fromNullableOrElse("default")(1), _.right(1))
  })

  it("fromThrowableOrElse", () => {
    deepStrictEqual(
      _.fromThrowableOrElse(() => {
        return 1
      }, identity),
      _.right(1)
    )

    deepStrictEqual(
      _.fromThrowableOrElse(() => {
        throw "string error"
      }, identity),
      _.left("string error")
    )
  })

  it("filterMapOrElse", () => {
    const p = (n: number) => n > 2
    const f = (n: number) => (p(n) ? O.some(n + 1) : O.none)
    deepStrictEqual(pipe(_.left("123"), _.filterMapOrElse(f, "")), _.left("123"))
    deepStrictEqual(pipe(_.right(1), _.filterMapOrElse(f, "")), _.left(String.Monoid.empty))
    deepStrictEqual(pipe(_.right(3), _.filterMapOrElse(f, "")), _.right(4))
  })

  it("getFirstErrorSemigroup", () => {
    const S = _.getFirstErrorSemigroup<number, string>(Number.SemigroupSum)
    deepStrictEqual(pipe(_.left("a"), S.combine(_.left("b"))), _.left("a"))
    deepStrictEqual(pipe(_.left("a"), S.combine(_.right(2))), _.left("a"))
    deepStrictEqual(pipe(_.right(1), S.combine(_.left("b"))), _.left("b"))
    deepStrictEqual(
      pipe(_.right(1), S.combine(_.right(2))),
      _.right(3)
    )
  })

  it("fromIterableOrElse", () => {
    deepStrictEqual(_.fromIterableOrElse("e")([]), _.left("e"))
    deepStrictEqual(_.fromIterableOrElse("e")(["a"]), _.right("a"))
  })

  it("getFirstSuccessSemigroup", () => {
    const S = _.getFirstSuccessSemigroup<string, number>()
    deepStrictEqual(pipe(_.left("a"), S.combine(_.left("b"))), _.left("b"))
    deepStrictEqual(pipe(_.left("a"), S.combine(_.right(2))), _.right(2))
    deepStrictEqual(pipe(_.right(1), S.combine(_.left("b"))), _.right(1))
    deepStrictEqual(
      pipe(_.right(1), S.combine(_.right(2))),
      _.right(1)
    )
  })

  it("firstSuccessOf", () => {
    deepStrictEqual(pipe(_.right(1), _.firstSuccessOf([])), _.right(1))
    deepStrictEqual(pipe(_.left("e"), _.firstSuccessOf([])), _.left("e"))
    deepStrictEqual(
      pipe(_.left("e1"), _.firstSuccessOf([_.left("e2"), _.left("e3"), _.left("e4"), _.right(1)])),
      _.right(1)
    )
    deepStrictEqual(
      pipe(_.left("e1"), _.firstSuccessOf([_.left("e2"), _.left("e3"), _.left("e4")])),
      _.left("e4")
    )
  })

  it("getSemigroup", () => {
    const S = _.getSemigroup<string, string>(String.Semigroup, String.Semigroup)
    deepStrictEqual(pipe(_.left("e1"), S.combine(_.left("e2"))), _.left("e1e2"))
    deepStrictEqual(pipe(_.left("e1"), S.combine(_.right("b"))), _.left("e1"))
    deepStrictEqual(pipe(_.right("a"), S.combine(_.left("e2"))), _.left("e2"))
    deepStrictEqual(
      pipe(_.right("a"), S.combine(_.right("b"))),
      _.right("ab")
    )
  })

  it("fromOptionOrElse", () => {
    deepStrictEqual(_.fromOptionOrElse("none")(O.none), _.left("none"))
    deepStrictEqual(_.fromOptionOrElse("none")(O.some(1)), _.right(1))
  })

  it("liftOptionOrElse", () => {
    const f = _.liftOptionOrElse((n: number) => (n > 0 ? O.some(n) : O.none), "a")
    deepStrictEqual(f(1), _.right(1))
    deepStrictEqual(f(-1), _.left("a"))
  })

  it("flatMapOptionOrElse", () => {
    const f = _.flatMapOptionOrElse((n: number) => (n > 0 ? O.some(n) : O.none), "a")
    deepStrictEqual(f(_.right(1)), _.right(1))
    deepStrictEqual(f(_.right(-1)), _.left("a"))
    deepStrictEqual(f(_.left("b")), _.left("b"))
  })

  it("exists", () => {
    const gt2 = _.exists((n: number) => n > 2)
    deepStrictEqual(gt2(_.left("a")), false)
    deepStrictEqual(gt2(_.right(1)), false)
    deepStrictEqual(gt2(_.right(3)), true)
  })

  it("do notation", () => {
    deepStrictEqual(
      pipe(
        _.right(1),
        _.bindTo("a"),
        _.bind("b", () => _.right("b")),
        _.let("c", ({ a, b }) => [a, b])
      ),
      _.right({ a: 1, b: "b", c: [1, "b"] })
    )
  })

  it("bindEither", () => {
    deepStrictEqual(
      pipe(_.right(1), _.bindTo("a"), _.bindEither("b", _.right("b"))),
      _.right({ a: 1, b: "b" })
    )
  })

  it("product", () => {
    deepStrictEqual(pipe(_.right(1), _.product(_.right("a"))), _.right([1, "a"] as const))
    deepStrictEqual(pipe(_.right(1), _.product(_.left("e2"))), _.left("e2"))
    deepStrictEqual(pipe(_.left("e1"), _.product(_.right("a"))), _.left("e1"))
    deepStrictEqual(pipe(_.left("e1"), _.product(_.left("2"))), _.left("e1"))
  })

  it("productMany", () => {
    deepStrictEqual(pipe(_.right(1), _.productMany([])), _.right([1] as const))
    deepStrictEqual(
      pipe(_.right(1), _.productMany([_.right(2), _.right(3)])),
      _.right([1, 2, 3] as const)
    )
    deepStrictEqual(
      pipe(_.right(1), _.productMany([_.left("e"), _.right(3)])),
      _.left("e")
    )
    deepStrictEqual(
      pipe(_.left("e"), _.productMany<string, number>([_.right(2), _.right(3)])),
      _.left("e")
    )
  })

  it("productAll", () => {
    deepStrictEqual(_.productAll([]), _.right([]))
    deepStrictEqual(
      _.productAll([_.right(1), _.right(2), _.right(3)]),
      _.right([1, 2, 3])
    )
    deepStrictEqual(
      _.productAll([_.left("e"), _.right(2), _.right(3)]),
      _.left("e")
    )
  })

  it("coproduct", () => {
    deepStrictEqual(pipe(_.right(1), _.NonEmptyCoproduct.coproduct(_.right(2))), _.right(1))
    deepStrictEqual(pipe(_.right(1), _.NonEmptyCoproduct.coproduct(_.left("e2"))), _.right(1))
    deepStrictEqual(pipe(_.left("e1"), _.NonEmptyCoproduct.coproduct(_.right(2))), _.right(2))
    deepStrictEqual(pipe(_.left("e1"), _.NonEmptyCoproduct.coproduct(_.left("e2"))), _.left("e2"))
  })

  it("coproductMany", () => {
    deepStrictEqual(pipe(_.right(1), _.NonEmptyCoproduct.coproductMany([_.right(2)])), _.right(1))
    deepStrictEqual(
      pipe(
        _.right(1) as _.Either<string, number>,
        _.NonEmptyCoproduct.coproductMany([_.left("e2") as _.Either<string, number>])
      ),
      _.right(1)
    )
    deepStrictEqual(
      pipe(
        _.left("e1") as _.Either<string, number>,
        _.NonEmptyCoproduct.coproductMany([_.right(2) as _.Either<string, number>])
      ),
      _.right(2)
    )
    deepStrictEqual(
      pipe(_.left("e1"), _.NonEmptyCoproduct.coproductMany([_.left("e2")])),
      _.left("e2")
    )
  })

  it("productFlatten", () => {
    deepStrictEqual(
      pipe(_.right(1), _.tupled, _.productFlatten(_.right("b"))),
      _.right([1, "b"] as const)
    )
  })

  it("liftNullableOrElse", () => {
    const f = _.liftNullableOrElse((n: number) => (n > 0 ? n : null), "error")
    deepStrictEqual(f(1), _.right(1))
    deepStrictEqual(f(-1), _.left("error"))
  })

  it("flatMapNullableOrElse", () => {
    const f = _.flatMapNullableOrElse((n: number) => (n > 0 ? n : null), "error")
    deepStrictEqual(f(_.right(1)), _.right(1))
    deepStrictEqual(f(_.right(-1)), _.left("error"))
    deepStrictEqual(f(_.left("a")), _.left("a"))
  })

  it("merge", () => {
    deepStrictEqual(_.merge(_.right(1)), 1)
    deepStrictEqual(_.merge(_.left("a")), "a")
  })

  it("liftThrowableOrElse", () => {
    const f = _.liftThrowableOrElse((s: string) => {
      const len = s.length
      if (len > 0) {
        return len
      }
      throw new Error("empty string")
    }, identity)
    deepStrictEqual(f("a"), _.right(1))
    deepStrictEqual(f(""), _.left(new Error("empty string")))
  })
})
