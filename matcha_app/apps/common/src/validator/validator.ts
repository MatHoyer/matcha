// A minimal custom clone of Zod

import { SchemaError } from '../errors/schema.error';
import { TErrorSchema } from '../schemas/api/error.schema';

// Base schema type
export abstract class ZodType<T> {
  /**
   * Parse the input data.
   * If invalid, throw an error.
   */
  abstract parse(data: unknown): T;

  /**
   * Parse the input data.
   * If invalid, return error.
   */
  safeParse(
    data: unknown
  ): { success: true; data: T } | { success: false; error: SchemaError } {
    try {
      const parsed = this.parse(data);
      return { success: true, data: parsed };
    } catch (error) {
      if (error instanceof SchemaError) {
        return { success: false, error };
      }
      return {
        success: false,
        error: new SchemaError({ message: 'unknown', fields: [] }),
      };
    }
  }

  /**
   * Adds a custom validation to the schema.
   * @param check A function that returns true if the data is valid.
   * @param message The error message to throw if validation fails.
   */
  refine(check: (data: T) => boolean, message: string): ZodType<T> {
    const self = this;
    return new (class extends ZodType<T> {
      parse(data: unknown): T {
        const parsed = self.parse(data);
        if (!check(parsed)) {
          throw new Error(message);
        }
        return parsed;
      }
    })();
  }

  optional() {
    const self = this;
    return new (class extends ZodType<T | undefined> {
      parse(data: unknown): T | undefined {
        if (data === undefined) {
          return undefined;
        }
        return self.parse(data);
      }
    })();
  }

  nullable() {
    const self = this;
    return new (class extends ZodType<T | null> {
      parse(data: unknown): T | null {
        if (data === null) {
          return null;
        }
        return self.parse(data);
      }
    })();
  }
}

// String schema
export class ZodString extends ZodType<string> {
  #tryCoerce(data: unknown): unknown {
    if (typeof data === 'number' || typeof data === 'boolean') {
      return String(data);
    }
    if (data instanceof Date) {
      return data.toISOString();
    }
    return data;
  }

  parse(data: unknown): string {
    const coercedData = this.#tryCoerce(data);
    if (typeof coercedData !== 'string') {
      throw new Error('Expected string, got ' + coercedData);
    }
    return coercedData;
  }

  email() {
    return this.refine(
      (data) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data),
      'Invalid email'
    ) as ZodString;
  }
  min(minLength: number) {
    return this.refine(
      (data) => data.length >= minLength,
      `Must be at least ${minLength} characters long`
    ) as ZodString;
  }
  max(maxLength: number) {
    return this.refine(
      (data) => data.length <= maxLength,
      `Must be at most ${maxLength} characters long`
    ) as ZodString;
  }
  regex(regex: RegExp, message?: string) {
    return this.refine(
      (data) => regex.test(data),
      message ?? 'Invalid input'
    ) as ZodString;
  }
  url() {
    return this.regex(
      /^(http:\/\/localhost:\d+\/|https?:\/\/[a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/.*)?$/
    ) as ZodString;
  }
}

// Number schema
export class ZodNumber extends ZodType<number> {
  #tryCoerce(data: unknown): unknown {
    if (typeof data === 'string') {
      const num = Number(data);
      if (isNaN(num)) {
        throw new Error('Invalid number string');
      }
      return num;
    }
    if (typeof data === 'boolean') {
      return data ? 1 : 0;
    }
    return data;
  }

  parse(data: unknown): number {
    const coercedData = this.#tryCoerce(data);
    if (typeof coercedData !== 'number') {
      throw new Error('Expected number, got ' + coercedData);
    }
    return coercedData;
  }

  positive() {
    return this.refine((data) => data > 0, 'Must be positive') as ZodNumber;
  }
  negative() {
    return this.refine((data) => data < 0, 'Must be negative') as ZodNumber;
  }
  min(minLength: number) {
    return this.refine(
      (data) => data >= minLength,
      `Must be at least ${minLength}`
    ) as ZodNumber;
  }
  max(maxLength: number) {
    return this.refine(
      (data) => data <= maxLength,
      `Must be at most ${maxLength}`
    ) as ZodNumber;
  }
}

// Boolean schema
export class ZodBoolean extends ZodType<boolean> {
  #tryCoerce(data: unknown): unknown {
    if (typeof data === 'string') {
      if (data.toLowerCase() === 'true') return true;
      if (data.toLowerCase() === 'false') return false;
      throw new Error('Invalid boolean string');
    }
    if (typeof data === 'number') {
      return data !== 0;
    }
    return data;
  }

  parse(data: unknown): boolean {
    const coercedData = this.#tryCoerce(data);
    if (typeof coercedData !== 'boolean') {
      throw new Error('Expected boolean, got ' + coercedData);
    }
    return coercedData;
  }
}

// Date schema
export class ZodDate extends ZodType<Date> {
  #tryCoerce(data: unknown): unknown {
    if (typeof data === 'string' || typeof data === 'number') {
      const date = new Date(data);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date;
    }
    return data;
  }

  parse(data: unknown): Date {
    const coercedData = this.#tryCoerce(data);
    if (!(coercedData instanceof Date)) {
      throw new Error('Expected date, got ' + coercedData);
    }
    return coercedData;
  }
}

// Null schema
export class ZodNull extends ZodType<null> {
  #tryCoerce(data: unknown): unknown {
    if (data !== null) {
      throw new Error(`Expected null, but received ${typeof data}`);
    }
    return null;
  }
  parse(data: unknown): null {
    const coercedData = this.#tryCoerce(data);
    if (coercedData !== null) {
      throw new Error(`Expected null, but received ${typeof coercedData}`);
    }
    return null;
  }
}

// Enum schema
export class ZodEnum<T extends string> extends ZodType<T> {
  public values: readonly T[];

  constructor(values: readonly T[]) {
    super();
    this.values = values;
  }

  parse(data: unknown): T {
    if (typeof data !== 'string' || !this.values.includes(data as T)) {
      throw new Error(
        `Expected one of: ${this.values.join(', ')}, got ${data}`
      );
    }
    return data as T;
  }
}

// Object schema
export class ZodObject<T extends { [key: string]: any }> extends ZodType<T> {
  public shape: { [K in keyof T]: ZodType<T[K]> };

  constructor(shape: { [K in keyof T]: ZodType<T[K]> }) {
    super();
    this.shape = shape;
  }

  parse(data: unknown): T {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Expected object, got ' + data);
    }
    const result: any = {};
    const errors = [] as TErrorSchema['fields'];

    for (const key in this.shape) {
      const validator = this.shape[key];
      try {
        result[key] = validator.parse((data as any)[key]);
      } catch (error) {
        if (error instanceof Error) {
          errors.push({ field: key, message: error.message });
        } else {
          throw new SchemaError({
            message: 'Unknown error',
            fields: [],
          });
        }
      }
    }
    if (errors.length > 0) {
      throw new SchemaError({
        message: 'Invalid object',
        fields: errors,
      });
    }
    return result;
  }
  pick<K extends keyof T>(keys: K[]): ZodObject<Pick<T, K>> {
    const pickedShape: { [K in keyof T]: ZodType<T[K]> } = {} as any;
    for (const key of keys) {
      pickedShape[key] = this.shape[key];
    }
    return new ZodObject(pickedShape);
  }
  partial(): ZodObject<Partial<T>> {
    const partialShape = {} as { [K in keyof T]: ZodType<T[K]> };
    for (const key in this.shape) {
      partialShape[key] = this.shape[key].optional() as any;
    }
    return new ZodObject(partialShape) as ZodObject<Partial<T>>;
  }
}

// Array schema
export class ZodArray<T> extends ZodType<T[]> {
  public itemType: ZodType<T>;

  constructor(itemType: ZodType<T>) {
    super();
    this.itemType = itemType;
  }

  parse(data: unknown): T[] {
    if (!Array.isArray(data)) {
      throw new Error('Expected array, got ' + data);
    }
    return data.map((item) => this.itemType.parse(item));
  }
}

// Union schema
export class ZodUnion<T extends ZodType<any>[]> extends ZodType<
  Infer<T[number]>
> {
  public schemas: T;

  constructor(schemas: T) {
    super();
    this.schemas = schemas;
  }

  parse(data: unknown): Infer<T[number]> {
    let lastError: unknown;
    for (const schema of this.schemas) {
      try {
        return schema.parse(data); // returns the type from the matching schema
      } catch (error) {
        lastError = error;
      }
    }
    throw new Error(`Invalid value. Could not match any of the union types.`);
  }
}

// File schema
export class ZodFile extends ZodType<File> {
  private _maxSize?: number;
  private _acceptedTypes?: string[];

  #tryCoerce(data: unknown): unknown {
    if (data instanceof Blob) {
      return new File([data], 'tmpFile', { type: data.type });
    }
    return data;
  }

  parse(data: unknown): File {
    const coercedData = this.#tryCoerce(data);
    if (!(coercedData instanceof File)) {
      throw new Error('Expected File, got ' + data);
    }

    if (this._maxSize && coercedData.size > this._maxSize) {
      throw new Error(
        `File size must be less than ${this._maxSize / (1024 * 1024)}MB`
      );
    }

    if (this._acceptedTypes && this._acceptedTypes.length > 0) {
      const fileType = coercedData.type;
      if (!this._acceptedTypes.some((type) => fileType.startsWith(type))) {
        throw new Error(
          `File must be one of: ${this._acceptedTypes.join(', ')}`
        );
      }
    }

    return coercedData;
  }

  maxSize(size: number) {
    this._maxSize = size;
    return this;
  }

  accept(types: string[]) {
    this._acceptedTypes = types;
    return this;
  }
}

// A utility object to create schemas easily
export const z = {
  string: () => new ZodString(),
  number: () => new ZodNumber(),
  boolean: () => new ZodBoolean(),
  date: () => new ZodDate(),
  null: () => new ZodNull(),
  file: () => new ZodFile(),
  enum: <T extends readonly string[]>(values: T) =>
    new ZodEnum<T[number]>(values),
  object: <T extends { [key: string]: any }>(shape: {
    [K in keyof T]: ZodType<T[K]>;
  }) => new ZodObject<T>(shape),
  array: <T>(itemType: ZodType<T>) => new ZodArray(itemType),
  union: <T extends ZodType<any>[]>(schemas: T): ZodUnion<T> =>
    new ZodUnion(schemas),
};

type OptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];

type MakeOptional<T> = Omit<T, OptionalKeys<T>> &
  Partial<Pick<T, OptionalKeys<T>>>;

type Flatten<T> = { [K in keyof T]: T[K] };

export type Infer<S extends ZodType<any>> = S extends ZodType<infer T>
  ? T extends object
    ? Flatten<MakeOptional<T>>
    : T
  : never;
