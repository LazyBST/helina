"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const lodash_1 = require("lodash");
class Collection {
    constructor(data) {
        this.raw = data || [];
        this.size = this.raw.length;
    }
    static make(data) {
        return new Collection(data);
    }
    first() {
        return this.raw[0];
    }
    last() {
        return this.raw[this.size - 1];
    }
    isNotEmpty() {
        return this.size > 0;
    }
    isEmpty() {
        return this.size == 0;
    }
    remove(elem) {
        return new Collection(this.raw.filter((e) => e !== elem));
    }
    pluck(key) {
        const values = [];
        if ((0, lodash_1.isObject)(this.raw[0])) {
            this.raw.forEach((el) => values.push((0, lodash_1.get)(el, key)));
        }
        return new Collection(values);
    }
    join(delimitter) {
        return this.raw.join(delimitter);
    }
    groupBy(key) {
        const obj = {};
        for (const el of this.raw) {
            const value = (0, lodash_1.get)(el, key);
            if (!obj[value])
                obj[value] = [];
            obj[value].push(el);
        }
        return obj;
    }
    push(elem) {
        this.raw.push(elem);
        this.size = this.raw.length;
        return this;
    }
    merge(elems) {
        this.raw = this.raw.concat(elems);
        this.size = this.raw.length;
        return this;
    }
    where(condition) {
        let filteredArray = this.raw;
        for (const key in condition) {
            filteredArray = filteredArray.filter((o) => {
                return (0, lodash_1.get)(o, key) === condition[key];
            });
        }
        return new Collection(filteredArray);
    }
    each(cb) {
        for (const i in this.raw) {
            cb(this.raw[i], i);
        }
    }
    sortByDesc(arr, key) {
        return (0, lodash_1.orderBy)(arr, [key], ['desc']);
    }
    sortBy(arr, key) {
        return (0, lodash_1.orderBy)(arr, [key], ['asc']);
    }
}
exports.Collection = Collection;
//# sourceMappingURL=collection.js.map