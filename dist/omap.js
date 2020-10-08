"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingKeyError = void 0;
/**
 * An error throw when a key is unexpectedly missing
 */
var MissingKeyError = /** @class */ (function (_super) {
    __extends(MissingKeyError, _super);
    function MissingKeyError(key) {
        var _this = _super.call(this, "No such key: \"" + key + "\"") || this;
        Object.setPrototypeOf(_this, MissingKeyError.prototype);
        _this.name = 'MissingKeyError';
        return _this;
    }
    return MissingKeyError;
}(Error));
exports.MissingKeyError = MissingKeyError;
/**
 * A map which maintains ordering of elements
 */
var OMap = /** @class */ (function () {
    function OMap(initialEntries) {
        var _a;
        this.order = [];
        this.mapping = new Map();
        this.order = (_a = initialEntries === null || initialEntries === void 0 ? void 0 : initialEntries.map(function (kv) { return kv[0]; })) !== null && _a !== void 0 ? _a : [];
        this.mapping = new Map(initialEntries !== null && initialEntries !== void 0 ? initialEntries : []);
    }
    Object.defineProperty(OMap.prototype, "length", {
        /**
         * Get the length of the omap.
         */
        get: function () {
            return this.order.length;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Iterator for all values in the omap.
     */
    OMap.prototype[Symbol.iterator] = function () {
        var _this = this;
        var i = 0;
        var length = this.length;
        return {
            next: function () {
                if (i === length) {
                    return {
                        value: null,
                        done: true
                    };
                }
                var value = _this.at(i);
                if (value == null) {
                    throw new Error("Unexpected null-ish value at index " + i);
                }
                i += 1;
                return {
                    value: value,
                    done: false
                };
            }
        };
    };
    /**
     * Get a value in the omap.
     *
     * @param key The ID of the value to get
     */
    OMap.prototype.get = function (key) {
        var _a;
        return (_a = this.mapping.get(key)) !== null && _a !== void 0 ? _a : null;
    };
    /**
     * Get a value in the omap, or throw an error.
     *
     * @param key The key of the value to get
     */
    OMap.prototype.mustGet = function (key) {
        var value = this.get(key);
        if (value == null) {
            throw new MissingKeyError(key);
        }
        return value;
    };
    /**
     * Get the value at the given index.
     *
     * @param index The index to get
     */
    OMap.prototype.at = function (index) {
        var _a;
        return (_a = this.mapping.get(this.order[index])) !== null && _a !== void 0 ? _a : null;
    };
    Object.defineProperty(OMap.prototype, "first", {
        /**
         * Get the first value in the omap.
         */
        get: function () {
            var _a;
            return (_a = this.mapping.get(this.order[0])) !== null && _a !== void 0 ? _a : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OMap.prototype, "last", {
        /**
         * Get the last value in the omap.
         */
        get: function () {
            var _a;
            return (_a = this.mapping.get(this.order[this.order.length - 1])) !== null && _a !== void 0 ? _a : null;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get the previous sibling, if any, of a value.
     *
     * @param key The key of the value to get the previous sibling of
     */
    OMap.prototype.getPreviousSibling = function (key) {
        var index = this.indexOf(key);
        if (index < 1) {
            return null;
        }
        return this.mustGet(this.order[index - 1]);
    };
    /**
     * Get the index of the given value in the omap.
     *
     * @param key The key of the value to get the index of
     */
    OMap.prototype.indexOf = function (key) {
        return this.order.indexOf(key);
    };
    /**
     * Insert a new value after the given one.
     *
     * @param after The key of the value to be inserted after
     * @param keyValue The key/value pair to insert
     */
    OMap.prototype.insertAfter = function (after, _a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        var index = this.indexOf(after);
        if (index === -1) {
            throw new MissingKeyError(after);
        }
        this.order.splice(index + 1, 0, key);
        this.mapping.set(key, value);
    };
    /**
     * Add the value(s) to the start of the list.
     *
     * @param kvs The key/value(s) to add
     */
    OMap.prototype.unshift = function () {
        var _a;
        var _this = this;
        var kvs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            kvs[_i] = arguments[_i];
        }
        (_a = this.order).unshift.apply(_a, __spread(kvs.map(function (kv) { return kv[0]; })));
        kvs.forEach(function (kv) {
            var _a;
            return (_a = _this.mapping).set.apply(_a, __spread(kv));
        });
    };
    /**
     * Add the value(s) to the end of the list.
     *
     * @param kvs The key/value(s) to add
     */
    OMap.prototype.push = function () {
        var _a;
        var _this = this;
        var kvs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            kvs[_i] = arguments[_i];
        }
        (_a = this.order).push.apply(_a, __spread(kvs.map(function (kv) { return kv[0]; })));
        kvs.forEach(function (kv) {
            var _a;
            return (_a = _this.mapping).set.apply(_a, __spread(kv));
        });
    };
    /**
     * Remove the value from the omap.
     *
     * @param key The key of the value to be removed
     */
    OMap.prototype.delete = function (key) {
        var index = this.order.indexOf(key);
        this.order.splice(index, 1);
        this.mapping.delete(key);
    };
    /**
     * Iterate over each value with a callback.
     *
     * The callback receives the value and its index.
     *
     * @param cb A callback for each value in the omap
     */
    OMap.prototype.forEach = function (cb) {
        var _this = this;
        this.order.forEach(function (key, index) {
            cb(_this.mustGet(key), index, _this);
        });
    };
    /**
     * Map over each value with a callback.
     *
     * The callback receives the value and its index.
     *
     * @param cb A callback for each value in the omap
     */
    OMap.prototype.map = function (cb) {
        var _this = this;
        return this.order.map(function (key, index) {
            return cb(_this.mustGet(key), index, _this);
        });
    };
    /**
     * Convert the omap to an array.
     */
    OMap.prototype.toArray = function () {
        return this.map(function (v) { return v; });
    };
    /**
     * Get all entries in the omap.
     */
    OMap.prototype.entries = function () {
        var _this = this;
        return this.order.map(function (key) { return [key, _this.mustGet(key)]; });
    };
    /**
     * Reduce over each value with a callback.
     *
     * The callback receives the previous value, the current value, and its
     * index.
     *
     * @param cb A callback for each value in the omap
     * @param init The initial value for the accumulator
     */
    OMap.prototype.reduce = function (cb, acc) {
        var _this = this;
        return this.order.reduce(function (acc, key, index) {
            return cb(acc, _this.mustGet(key), index, _this);
        }, acc);
    };
    return OMap;
}());
exports.default = OMap;
