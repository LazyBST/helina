import { GenericFunction } from '../constants';
declare enum DateFormat {
    'YYYY-DD-MM' = "YYYY-DD-MM",
    'YYYY/DD/MM' = "YYYY/DD/MM",
    'DD-MM-YYYY' = "DD-MM-YYYY",
    'DD/MM/YYYY' = "DD/MM/YYYY",
    'MM-DD-YYYY' = "MM-DD-YYYY",
    'MM/DD/YYYY' = "MM/DD/YYYY",
    'YYYY/MM/DD' = "YYYY/MM/DD",
    'YYYY-MM-DD' = "YYYY-MM-DD"
}
export declare class Collection<T = any> {
    raw: Array<any>;
    size: number;
    constructor(data?: Array<any>);
    static make<T>(data?: Array<any>): Collection<T>;
    first(): T;
    last(): T;
    isNotEmpty(): boolean;
    isEmpty(): boolean;
    remove<T>(elem: T): Collection<T>;
    pluck(key: string): Collection<T>;
    join(delimitter: string): string;
    groupBy(key: string): Record<string, any>;
    push(elem: any): this;
    merge(elems: any[]): this;
    where(condition: Record<string, any>): Collection<T>;
    each(cb: GenericFunction): void;
    sortByDesc<T>(arr: T[], key: string): T[];
    sortBy<T>(arr: T[], key: string): T[];
    sqlQueryStringFilter<T>(payload: Array<any>): string;
    toString<T>(list: Array<any>): string;
    sqlRlsQueryString(rls_payload: {
        [k: string]: any;
    }): string;
    toBoolean(value: string | number | boolean): boolean | null;
    stringToNumber(string_value: string): Number;
    convertDbDateToUserDate(utcDateString: string, dateFormat: DateFormat, timeZone: string): string | null;
    convertUserDateToDbDate(dateString: string, dateFormat: DateFormat): Date | null;
}
export {};
