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
  parse(data: unknown): string {
    if (typeof data !== 'string') {
      throw new Error('Expected string, got ' + data);
    }
    return data;
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
  regex(regex: RegExp) {
    return this.refine(
      (data) => regex.test(data),
      'Invalid input'
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
  parse(data: unknown): number {
    if (typeof data !== 'number') {
      throw new Error('Expected number, got ' + data);
    }
    return data;
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
  parse(data: unknown): boolean {
    if (typeof data !== 'boolean') {
      throw new Error('Expected boolean, got ' + data);
    }
    return data;
  }
}

// Date schema
export class ZodDate extends ZodType<Date> {
  parse(data: unknown): Date {
    if (!(data instanceof Date)) {
      throw new Error('Expected date, got ' + data);
    }
    return data;
  }
}

// Null schema
export class ZodNull extends ZodType<null> {
  parse(data: unknown): null {
    if (data !== null) {
      throw new Error(`Expected null, but received ${typeof data}`);
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

// A utility object to create schemas easily
export const z = {
  string: () => new ZodString(),
  number: () => new ZodNumber(),
  boolean: () => new ZodBoolean(),
  date: () => new ZodDate(),
  null: () => new ZodNull(),
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
