import { expectTypeOf } from 'expect-type'
import { buildProp, mutable, keyOf } from '../props'

describe('buildProp', () => {
  it('Only type', () => {
    expectTypeOf(
      buildProp({
        type: String,
      })
    ).toEqualTypeOf()
  })

  it('Only values', () => {
    expectTypeOf(
      buildProp({
        values: [1, 2, 3, 4],
      })
    ).toEqualTypeOf()
  })

  it('Type and values', () => {
    expectTypeOf(
      buildProp({
        type: Array,
        values: [1, 2, 3, 4],
      })
    ).toEqualTypeOf()
  })

  it('Values and validator', () => {
    expectTypeOf(
      buildProp({
        values: ['a', 'b', 'c'],
        validator: (val) => typeof val === 'number',
      })
    ).toEqualTypeOf()
  })

  it('Values and required', () => {
    expectTypeOf(
      buildProp({
        values: ['a', 'b', 'c'],
        required: true,
      })
    ).toEqualTypeOf()
  })

  it('Value and default', () => {
    expectTypeOf(
      buildProp({
        values: ['a', 'b', 'c'],
        required: false,
        default: 'b',
      })
    ).toEqualTypeOf()
  })

  it('Type and Array default value', () => {
    expectTypeOf(
      buildProp({
        type: Array,
        default: () => mutable(['a', 'b']),
      })
    ).toEqualTypeOf()
  })

  it('Type and Object default value', () => {
    expectTypeOf(
      buildProp({
        type: Object,
        default: () => mutable({ key: 'value' }),
      })
    ).toEqualTypeOf()
  })

  it('Type, validator and Object default value', () => {
    expectTypeOf(
      buildProp({
        type: Object,
        default: () => ({ key: 'value' }),
        validator: () => true,
      })
    ).toEqualTypeOf()
  })

  it('Type, validator, required', () => {
    expectTypeOf(
      buildProp({
        type: String,
        required: true,
        validator: () => true,
      })
    ).toEqualTypeOf()
  })

  it('Normal type', () => {
    expectTypeOf(
      buildProp({
        type: String,
      })
    ).toEqualTypeOf()
  })

  it('Normal types', () => {
    expectTypeOf(buildProp({ type: [String, Number, Boolean] })).toEqualTypeOf()
  })

  it('Normal type and values', () => {
    expectTypeOf(
      buildProp({
        type: String,
        values: ['1', '2', '3'],
      })
    ).toEqualTypeOf()
  })

  it('Required and validator', () => {
    expectTypeOf(
      buildProp({
        required: true,
        validator: () => true,
      })
    ).toEqualTypeOf()
  })

  it('Required and validator', () => {
    expectTypeOf(
      buildProp({
        values: keyOf({ a: 'a', b: 'b' }),
        default: 'a',
      })
    ).toEqualTypeOf()
  })

  it('Type and default value', () => {
    expectTypeOf(
      buildProp({
        type: Object,
        default: () => mutable({ key: 'a' }),
      })
    ).toEqualTypeOf()
  })

  it('Type and default value', () => {
    expectTypeOf(
      buildProp({
        type: [String, Number],
        default: '',
      })
    ).toEqualTypeOf()
  })

  it('extract', () => {
    expectTypeOf().toEqualTypeOf()
  })
})
