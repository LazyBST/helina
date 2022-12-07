"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const lodash_1 = require("lodash");
var DateFormat;
(function (DateFormat) {
    DateFormat["YYYY-DD-MM"] = "YYYY-DD-MM";
    DateFormat["DD-MM-YYYY"] = "DD-MM-YYYY";
    DateFormat["MM-DD-YYYY"] = "MM-DD-YYYY";
    DateFormat["DD/MM/YYYY"] = "DD/MM/YYYY";
    DateFormat["MM/DD/YYYY"] = "MM/DD/YYYY";
    DateFormat["YYYY/MM/DD"] = "YYYY/MM/DD";
})(DateFormat || (DateFormat = {}));
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
    sqlQueryStringFilter(payload) {
        let query_string = '(';
        let outer_count = 0;
        for (const item of payload) {
            let inner_count = 0;
            for (const [key, value] of Object.entries(item)) {
                inner_count += 1;
                query_string += `${key}=${value}`;
                if (Object.keys(item).length != inner_count)
                    query_string += ' AND ';
            }
            outer_count += 1;
            if (payload.length != outer_count)
                query_string += ') OR (';
        }
        query_string += ')';
        return query_string;
    }
    toString(list) {
        return list.toString();
    }
    sqlRlsQueryString(rls_payload) {
        let rls_query_string = '';
        for (const [_, entity] of Object.entries(rls_payload)) {
            let outer_count = 0;
            rls_query_string += '(';
            for (const [rls_attr_key, rls_attr_value] of Object.entries(entity)) {
                outer_count += 1;
                let inner_count = 0;
                for (const item of rls_attr_value) {
                    inner_count += 1;
                    rls_query_string += rls_attr_key;
                    rls_query_string += '=';
                    rls_query_string += item;
                    if (inner_count != rls_attr_value.length)
                        rls_query_string += ' OR ';
                }
                if (outer_count != Object.keys(entity).length)
                    rls_query_string += ') AND (';
            }
            rls_query_string += ')';
        }
        return rls_query_string;
    }
    toBoolean(value) {
        var _a;
        if (typeof (value) === 'string') {
            switch ((_a = value === null || value === void 0 ? void 0 : value.toLowerCase()) === null || _a === void 0 ? void 0 : _a.trim()) {
                case "true":
                case "yes":
                case "1":
                    return true;
                case "false":
                case "no":
                case "0":
                    return false;
                default:
                    return null;
            }
        }
        else if (typeof (value) === 'number') {
            switch (value) {
                case 1:
                    return true;
                case 0:
                    return false;
                default:
                    return null;
            }
        }
        else if (typeof (value) === 'boolean') {
            return value;
        }
        else {
            return null;
        }
    }
    stringToNumber(string_value) {
        return Number(string_value);
    }
    convertDbDateToUserDate(utcDateString, dateFormat, timeZone) {
        var _a;
        let date;
        try {
            date = new Date((_a = new Date(utcDateString)) === null || _a === void 0 ? void 0 : _a.toLocaleString('en-US', { timeZone }));
        }
        catch (err) {
            console.error(`Error converting date as per timezone ::  ${err}`);
        }
        if (isNaN(date === null || date === void 0 ? void 0 : date.getTime())) {
            return null;
        }
        const day = `0${date.getDate()}`.slice(-2);
        const month = `0${date.getMonth()}`.slice(-2);
        const year = date.getFullYear();
        let userDate = '';
        switch (dateFormat) {
            case DateFormat['DD-MM-YYYY']: {
                userDate = `${day}-${month}-${year}`;
                break;
            }
            case DateFormat['DD/MM/YYYY']: {
                userDate = `${day}/${month}/${year}`;
                break;
            }
            case DateFormat['MM-DD-YYYY']: {
                userDate = `${month}-${day}-${year}`;
                break;
            }
            case DateFormat['MM/DD/YYYY']: {
                userDate = `${month}/${day}/${year}`;
                break;
            }
            case DateFormat['YYYY/MM/DD']: {
                userDate = `${year}/${month}/${day}`;
                break;
            }
            case DateFormat['YYYY-DD-MM']: {
                userDate = `${year}-${day}-${month}`;
                break;
            }
            default: {
                userDate = null;
            }
        }
        return userDate;
    }
    convertUserDateToDbDate(dateString, dateFormat) {
        const hyphenSeparatedDate = dateString.split('-');
        const slashSeparatedDate = dateString.split('/');
        let dateInfo;
        if (hyphenSeparatedDate.length !== 3 && slashSeparatedDate.length !== 3) {
            return null;
        }
        else if (hyphenSeparatedDate.length !== 3 &&
            slashSeparatedDate.length === 3) {
            dateInfo = slashSeparatedDate;
        }
        else if (hyphenSeparatedDate.length === 3 &&
            slashSeparatedDate.length !== 3) {
            dateInfo = hyphenSeparatedDate;
        }
        else {
            return null;
        }
        let day, month, year, outputDate;
        switch (dateFormat) {
            case DateFormat['DD/MM/YYYY']:
            case DateFormat['DD-MM-YYYY']: {
                day = dateInfo[0];
                month = dateInfo[1];
                year = dateInfo[2];
                outputDate = new Date(`${year}-${month}-${day}`);
                break;
            }
            case DateFormat['MM-DD-YYYY']:
            case DateFormat['MM/DD/YYYY']: {
                month = dateInfo[0];
                day = dateInfo[1];
                year = dateInfo[2];
                outputDate = new Date(`${year}-${month}-${day}`);
                break;
            }
            case DateFormat['YYYY-DD-MM']:
            case DateFormat['YYYY/MM/DD']: {
                outputDate = new Date(dateString);
                break;
            }
            default: {
                outputDate = null;
            }
        }
        if (outputDate === null || isNaN(outputDate === null || outputDate === void 0 ? void 0 : outputDate.getTime())) {
            return null;
        }
        else {
            return outputDate;
        }
    }
}
exports.Collection = Collection;
//# sourceMappingURL=collection.js.map