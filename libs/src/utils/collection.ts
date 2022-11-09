import { get, isObject, orderBy } from 'lodash';
import { GenericFunction } from '../constants';

export class Collection<T = any> {
  public raw: Array<any>;
  public size: number;

  constructor(data?: Array<any>) {
    this.raw = data || [];
    this.size = this.raw.length;
  }

  static make<T>(data?: Array<any>): Collection<T> {
    return new Collection<T>(data);
  }

  first(): T {
    return this.raw[0];
  }

  last(): T {
    return this.raw[this.size - 1];
  }

  isNotEmpty(): boolean {
    return this.size > 0;
  }

  isEmpty(): boolean {
    return this.size == 0;
  }

  remove<T>(elem: T): Collection<T> {
    return new Collection(this.raw.filter((e) => e !== elem));
  }

  pluck(key: string): Collection<T> {
    const values = [];
    if (isObject(this.raw[0])) {
      this.raw.forEach((el) => values.push(get(el, key)));
    }

    return new Collection(values);
  }

  join(delimitter: string): string {
    return this.raw.join(delimitter);
  }

  groupBy(key: string): Record<string, any> {
    const obj = {};
    for (const el of this.raw) {
      const value = get(el, key);
      if (!obj[value]) obj[value] = [];
      obj[value].push(el);
    }

    return obj;
  }

  push(elem: any): this {
    this.raw.push(elem);
    this.size = this.raw.length;
    return this;
  }

  merge(elems: any[]): this {
    this.raw = this.raw.concat(elems);
    this.size = this.raw.length;
    return this;
  }

  where(condition: Record<string, any>): Collection<T> {
    let filteredArray = this.raw;
    for (const key in condition) {
      filteredArray = filteredArray.filter((o) => {
        return get(o, key) === condition[key];
      });
    }
    return new Collection(filteredArray);
  }

  each(cb: GenericFunction): void {
    for (const i in this.raw) {
      cb(this.raw[i], i);
    }
  }

  sortByDesc<T>(arr: T[], key: string): T[] {
    return orderBy(arr, [key], ['desc']);
  }

  sortBy<T>(arr: T[], key: string): T[] {
    return orderBy(arr, [key], ['asc']);
  }

  sql_query_string_filter<T>(payload: Array<any>): string {
    let query_string = '('
    let outer_count = 0
    for (const item of payload) {
      let inner_count = 0
      for (const [key,value] of Object.entries(item)) {
        inner_count +=1
        query_string += `${key}=${value}`
        if(Object.keys(item).length != inner_count)
          query_string += ' AND '
      }
      outer_count +=1
      if(payload.length != outer_count)
        query_string += ') OR ('
      
    }
    query_string += ')'
    return query_string
  }

  to_string<T>(list: Array<any>): string {
    return list.toString()
  }

  sql_rls_query_string (rls_payload:{[k: string]: any}): string {
    let rls_query_string  = ''
    for (const [_,entity] of Object.entries(rls_payload)) {
      let outer_count = 0
      rls_query_string += '('
      for (const [rls_attr_key,rls_attr_value] of Object.entries<any[]>(entity)) {
        outer_count += 1
        let inner_count = 0
        for(const item of rls_attr_value) {
          inner_count += 1
          rls_query_string += rls_attr_key
          rls_query_string += '='
          rls_query_string +=item
          if(inner_count != rls_attr_value.length)
            rls_query_string += ' OR '
        }
      if(outer_count != Object.keys(entity).length)
        rls_query_string += ') AND ('
      }
    rls_query_string += ')'
    }
    return rls_query_string
  }

  to_boolean(string_value:string|number): boolean | null {
    if (typeof(string_value) == 'string') {
      switch(string_value?.toLowerCase()?.trim()) {
        case "true": 
        case "yes": 
        case "1": 
          return true

        case "false": 
        case "no": 
        case "0":
          return false

        default: 
          return null
      }
    } else if(typeof(string_value) == 'number') {
      switch(string_value) { 
        case 1: 
          return true
        case 0:
          return false
        default: 
          return null
      }
    }
    else {
      return null
    }
  }

  string_to_number(string_value:string): Number {
    return Number(string_value)
  }
}
