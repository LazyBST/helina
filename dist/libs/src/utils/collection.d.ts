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
}
