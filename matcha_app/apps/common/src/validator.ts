// A minimal custom clone of Zod

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
  ): { success: true; data: T } | { success: false; error: unknown } {
    try {
      const parsed = this.parse(data);
      return { success: true, data: parsed };
    } catch (error) {
      return { success: false, error };
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
}

// String schema
class ZodString extends ZodType<string> {
  parse(data: unknown): string {
    if (typeof data !== 'string') {
      throw new Error('Expected string: ' + data);
    }
    return data;
  }
  email() {
    return this.refine(
      (data) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data),
      'Invalid email'
    );
  }
  min(minLength: number) {
    return this.refine(
      (data) => data.length >= minLength,
      `Must be at least ${minLength} characters long`
    );
  }
  max(maxLength: number) {
    return this.refine(
      (data) => data.length <= maxLength,
      `Must be at most ${maxLength} characters long`
    );
  }
  regex(regex: RegExp) {
    return this.refine((data) => regex.test(data), 'Invalid input');
  }
  url() {
    return this.regex(
      /^(http:\/\/localhost:\d+\/|https?:\/\/[a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/.*)?$/
    );
  }
}

// Number schema
class ZodNumber extends ZodType<number> {
  parse(data: unknown): number {
    if (typeof data !== 'number') {
      throw new Error('Expected number: ' + data);
    }
    return data;
  }
  positive() {
    return this.refine((data) => data > 0, 'Must be positive');
  }
  negative() {
    return this.refine((data) => data < 0, 'Must be negative');
  }
  min(minLength: number) {
    return this.refine(
      (data) => data >= minLength,
      `Must be at least ${minLength}`
    );
  }
  max(maxLength: number) {
    return this.refine(
      (data) => data <= maxLength,
      `Must be at most ${maxLength}`
    );
  }
}

// Boolean schema
class ZodBoolean extends ZodType<boolean> {
  parse(data: unknown): boolean {
    if (typeof data !== 'boolean') {
      throw new Error('Expected boolean: ' + data);
    }
    return data;
  }
}

// Date schema
class ZodDate extends ZodType<Date> {
  parse(data: unknown): Date {
    if (!(data instanceof Date)) {
      throw new Error('Expected date: ' + data);
    }
    return data;
  }
}

// Enum schema
class ZodEnum<T extends string> extends ZodType<T> {
  private values: readonly T[];

  constructor(values: readonly T[]) {
    super();
    this.values = values;
  }

  parse(data: unknown): T {
    if (typeof data !== 'string' || !this.values.includes(data as T)) {
      throw new Error(`Expected one of: ${this.values.join(', ')}: ${data}`);
    }
    return data as T;
  }
}

// Object schema
class ZodObject<T extends { [key: string]: any }> extends ZodType<T> {
  public shape: { [K in keyof T]: ZodType<T[K]> };

  constructor(shape: { [K in keyof T]: ZodType<T[K]> }) {
    super();
    this.shape = shape;
  }

  parse(data: unknown): T {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Expected object: ' + data);
    }
    const result: any = {};
    for (const key in this.shape) {
      const validator = this.shape[key];
      result[key] = validator.parse((data as any)[key]);
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
}

// Array schema
class ZodArray<T> extends ZodType<T[]> {
  private itemType: ZodType<T>;

  constructor(itemType: ZodType<T>) {
    super();
    this.itemType = itemType;
  }

  parse(data: unknown): T[] {
    if (!Array.isArray(data)) {
      throw new Error('Expected array: ' + data);
    }
    return data.map((item) => this.itemType.parse(item));
  }
}

// A utility object to create schemas easily
export const z = {
  string: () => new ZodString(),
  number: () => new ZodNumber(),
  boolean: () => new ZodBoolean(),
  date: () => new ZodDate(),
  enum: <T extends readonly string[]>(values: T) =>
    new ZodEnum<T[number]>(values),
  object: <T extends { [key: string]: any }>(shape: {
    [K in keyof T]: ZodType<T[K]>;
  }) => new ZodObject<T>(shape),
  array: <T>(itemType: ZodType<T>) => new ZodArray(itemType),
};

export type Infer<S extends ZodType<any>> = S extends ZodType<infer T>
  ? T
  : never;
