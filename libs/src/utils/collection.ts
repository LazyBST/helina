import { get, isObject, orderBy } from 'lodash';
import { LoggerService } from '..';
import { GenericFunction } from '../constants';

enum DateFormat {
  'YYYY-DD-MM' = 'YYYY-DD-MM',
  'YYYY/DD/MM' = 'YYYY/DD/MM',
  'DD-MM-YYYY' = 'DD-MM-YYYY',
  'DD/MM/YYYY' = 'DD/MM/YYYY',
  'MM-DD-YYYY' = 'MM-DD-YYYY',
  'MM/DD/YYYY' = 'MM/DD/YYYY',
  'YYYY/MM/DD' = 'YYYY/MM/DD',
  'YYYY-MM-DD' = 'YYYY-MM-DD',
}
export class Collection<T = any> {
  public raw: Array<any>;
  public size: number;
  public logger: LoggerService;

  constructor(data: Array<any>) {
    this.raw = data || [];
    this.size = this.raw.length;
    this.logger = new LoggerService({
      appName: "HELINA",
    })
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

  sqlQueryStringFilter<T>(payload: Array<any>): string {
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

  toString<T>(list: Array<any>): string {
    return list.toString()
  }

  sqlRlsQueryString (rls_payload:{[k: string]: any}): string {
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

  toBoolean(value:string|number|boolean): boolean | null {
    if (typeof(value) === 'string') {
      switch(value?.toLowerCase()?.trim()) {
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
    } else if(typeof(value) === 'number') {
      switch(value) { 
        case 1: 
          return true
        case 0:
          return false
        default: 
          return null
      }
    }
    else if(typeof(value) === 'boolean') {
      return value
    }
    else {
      return null
    }
  }

  stringToNumber(string_value:string): Number {
    return Number(string_value)
  }

  convertDbDateToUserDate(
    utcDateString: string,
    dateFormat: DateFormat,
    timeZone: string,
  ): string | null {
    this.logger.error("HELLO I AM  LOGGER")
    let date: Date;
    try {
      date = new Date(
        new Date(utcDateString)?.toLocaleString('en-US', { timeZone }),
      );
    } catch (err) {
      console.error(`Error converting date as per timezone ::  ${err}`);
    }

    if (isNaN(date?.getTime())) {
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
      case DateFormat['YYYY-MM-DD']: {
        userDate = `${year}-${month}-${day}`;
        break;
      }
      case DateFormat['YYYY-DD-MM']: {
        userDate = `${year}-${day}-${month}`;
        break;
      }
      case DateFormat['YYYY/DD/MM']: {
        userDate = `${year}/${day}/${month}`;
        break;
      }
      default: {
        userDate = null;
      }
    }

    return userDate;
  }

  convertUserDateToDbDate(
    dateString: string,
    dateFormat: DateFormat,
  ): Date | null {
    const hyphenSeparatedDate = dateString.split('-');
    const slashSeparatedDate = dateString.split('/');
    let dateInfo: string[];

    if (
      hyphenSeparatedDate.length !== 3 &&
      slashSeparatedDate.length === 3
    ) {
      dateInfo = slashSeparatedDate;
    } else if (
      hyphenSeparatedDate.length === 3 &&
      slashSeparatedDate.length !== 3
    ) {
      dateInfo = hyphenSeparatedDate;
    } else {
      return null;
    }

    let day: string, month: string, year: string, outputDate: Date;

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
      case DateFormat['YYYY/DD/MM']: {
        year = dateInfo[0];
        day = dateInfo[1];
        month = dateInfo[2];

        outputDate = new Date(`${year}-${month}-${day}`);
        break;
      }
      case DateFormat['YYYY-MM-DD']:
      case DateFormat['YYYY/MM/DD']: {
        outputDate = new Date(dateString);
        break;
      }
      default: {
        outputDate = null;
      }
    }

    if (outputDate === null || isNaN(outputDate?.getTime())) {
      return null;
    } else {
      return outputDate;
    }
  }

}
