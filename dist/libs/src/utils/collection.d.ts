import { GenericFunction } from '../constants';
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
    sql_query_string_filter<T>(payload: Array<any>): string;
    to_string<T>(list: Array<any>): string;
    sql_rls_query_string(rls_payload: {
        [k: string]: any;
    }): string;
    to_boolean(string_value: string | number): boolean | null;
    string_to_number(string_value: string): Number;
}
