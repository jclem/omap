/**
 * A key/value pair
 */
export type KV<K, V> = [K, V]

/**
 * An error throw when a key is unexpectedly missing
 */
export class MissingKeyError<K> extends Error {
  constructor(key: K) {
    super(`No such key: "${key}"`)
    Object.setPrototypeOf(this, MissingKeyError.prototype)
    this.name = 'MissingKeyError'
  }
}

/**
 * A map which maintains ordering of elements
 */
export default class OMap<K, V> {
  private order: K[] = []
  private mapping: Map<K, V> = new Map()

  constructor(initialEntries?: KV<K, V>[]) {
    this.order = initialEntries?.map(kv => kv[0]) ?? []
    this.mapping = new Map(initialEntries ?? [])
  }

  /**
   * Get the length of the omap.
   */
  get length(): number {
    return this.order.length
  }

  /**
   * Iterator for all values in the omap.
   */
  [Symbol.iterator](): Iterator<V, null> {
    let i = 0
    const length = this.length

    return {
      next: () => {
        if (i === length) {
          return {
            value: null,
            done: true
          }
        }

        const value = this.at(i)

        if (value == null) {
          throw new Error(`Unexpected null-ish value at index ${i}`)
        }

        i += 1

        return {
          value,
          done: false
        }
      }
    }
  }

  /**
   * Get a value in the omap.
   *
   * @param key The ID of the value to get
   */
  get(key: K): V | null {
    return this.mapping.get(key) ?? null
  }

  /**
   * Get a value in the omap, or throw an error.
   *
   * @param key The key of the value to get
   */
  mustGet(key: K): V {
    const value = this.get(key)

    if (value == null) {
      throw new MissingKeyError(key)
    }

    return value
  }

  /**
   * Get the value at the given index.
   *
   * @param index The index to get
   */
  at(index: number): V | null {
    return this.mapping.get(this.order[index]) ?? null
  }

  /**
   * Get the first value in the omap.
   */
  get first(): V | null {
    return this.mapping.get(this.order[0]) ?? null
  }

  /**
   * Get the last value in the omap.
   */
  get last(): V | null {
    return this.mapping.get(this.order[this.order.length - 1]) ?? null
  }

  /**
   * Get the previous sibling, if any, of a value.
   *
   * @param key The key of the value to get the previous sibling of
   */
  getPreviousSibling(key: K): V | null {
    const index = this.indexOf(key)

    if (index < 1) {
      return null
    }

    return this.mustGet(this.order[index - 1])
  }

  /**
   * Get the index of the given value in the omap.
   *
   * @param key The key of the value to get the index of
   */
  indexOf(key: K): number {
    return this.order.indexOf(key)
  }

  /**
   * Insert a new value after the given one.
   *
   * @param after The key of the value to be inserted after
   * @param keyValue The key/value pair to insert
   */
  insertAfter(after: K, [key, value]: KV<K, V>): void {
    const index = this.indexOf(after)

    if (index === -1) {
      throw new MissingKeyError(after)
    }

    this.order.splice(index + 1, 0, key)
    this.mapping.set(key, value)
  }

  /**
   * Add the value(s) to the start of the list.
   *
   * @param kvs The key/value(s) to add
   */
  unshift(...kvs: KV<K, V>[]): void {
    this.order.unshift(...kvs.map(kv => kv[0]))
    kvs.forEach(kv => this.mapping.set(...kv))
  }

  /**
   * Add the value(s) to the end of the list.
   *
   * @param kvs The key/value(s) to add
   */
  push(...kvs: KV<K, V>[]): void {
    this.order.push(...kvs.map(kv => kv[0]))
    kvs.forEach(kv => this.mapping.set(...kv))
  }

  /**
   * Remove the value from the omap.
   *
   * @param key The key of the value to be removed
   */
  delete(key: K): void {
    const index = this.order.indexOf(key)
    this.order.splice(index, 1)
    this.mapping.delete(key)
  }

  /**
   * Iterate over each value with a callback.
   *
   * The callback receives the value and its index.
   *
   * @param cb A callback for each value in the omap
   */
  forEach(cb: (v: V, index: number, omap: this) => unknown): void {
    this.order.forEach((key, index) => {
      cb(this.mustGet(key), index, this)
    })
  }

  /**
   * Map over each value with a callback.
   *
   * The callback receives the value and its index.
   *
   * @param cb A callback for each value in the omap
   */
  map<T>(cb: (v: V, index: number, omap: this) => T): T[] {
    return this.order.map((key, index) => {
      return cb(this.mustGet(key), index, this)
    })
  }

  /**
   * Convert the omap to an array.
   */
  toArray(): V[] {
    return this.map(v => v)
  }

  /**
   * Reduce over each value with a callback.
   *
   * The callback receives the previous value, the current value, and its
   * index.
   *
   * @param cb A callback for each value in the omap
   * @param init The initial value for the accumulator
   */
  reduce<A>(cb: (acc: A, v: V, index: number, omap: this) => A, acc: A): A {
    return this.order.reduce((acc, key, index) => {
      return cb(acc, this.mustGet(key), index, this)
    }, acc)
  }
}
