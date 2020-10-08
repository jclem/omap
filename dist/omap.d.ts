/**
 * A key/value pair
 */
export declare type KV<K, V> = [K, V];
/**
 * An error throw when a key is unexpectedly missing
 */
export declare class MissingKeyError<K> extends Error {
    constructor(key: K);
}
/**
 * A map which maintains ordering of elements
 */
export default class OMap<K, V> {
    private order;
    private mapping;
    constructor(initialEntries?: KV<K, V>[]);
    /**
     * Get the length of the omap.
     */
    get length(): number;
    /**
     * Iterator for all values in the omap.
     */
    [Symbol.iterator](): Iterator<V, null>;
    /**
     * Get a value in the omap.
     *
     * @param key The ID of the value to get
     */
    get(key: K): V | null;
    /**
     * Get a value in the omap, or throw an error.
     *
     * @param key The key of the value to get
     */
    mustGet(key: K): V;
    /**
     * Get the value at the given index.
     *
     * @param index The index to get
     */
    at(index: number): V | null;
    /**
     * Get the first value in the omap.
     */
    get first(): V | null;
    /**
     * Get the last value in the omap.
     */
    get last(): V | null;
    /**
     * Get the previous sibling, if any, of a value.
     *
     * @param key The key of the value to get the previous sibling of
     */
    getPreviousSibling(key: K): V | null;
    /**
     * Get the index of the given value in the omap.
     *
     * @param key The key of the value to get the index of
     */
    indexOf(key: K): number;
    /**
     * Insert a new value after the given one.
     *
     * @param after The key of the value to be inserted after
     * @param keyValue The key/value pair to insert
     */
    insertAfter(after: K, [key, value]: KV<K, V>): void;
    /**
     * Add the value(s) to the start of the list.
     *
     * @param kvs The key/value(s) to add
     */
    unshift(...kvs: KV<K, V>[]): void;
    /**
     * Add the value(s) to the end of the list.
     *
     * @param kvs The key/value(s) to add
     */
    push(...kvs: KV<K, V>[]): void;
    /**
     * Remove the value from the omap.
     *
     * @param key The key of the value to be removed
     */
    delete(key: K): void;
    /**
     * Iterate over each value with a callback.
     *
     * The callback receives the value and its index.
     *
     * @param cb A callback for each value in the omap
     */
    forEach(cb: (v: V, index: number, omap: this) => unknown): void;
    /**
     * Map over each value with a callback.
     *
     * The callback receives the value and its index.
     *
     * @param cb A callback for each value in the omap
     */
    map<T>(cb: (v: V, index: number, omap: this) => T): T[];
    /**
     * Convert the omap to an array.
     */
    toArray(): V[];
    /**
     * Reduce over each value with a callback.
     *
     * The callback receives the previous value, the current value, and its
     * index.
     *
     * @param cb A callback for each value in the omap
     * @param init The initial value for the accumulator
     */
    reduce<A>(cb: (acc: A, v: V, index: number, omap: this) => A, acc: A): A;
}
