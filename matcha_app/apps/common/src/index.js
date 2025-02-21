"use strict";
// A minimal custom clone of Zod
Object.defineProperty(exports, "__esModule", { value: true });
exports.z = exports.ZodType = void 0;
// Base schema type
class ZodType {
    /**
     * Adds a custom validation to the schema.
     * @param check A function that returns true if the data is valid.
     * @param message The error message to throw if validation fails.
     */
    refine(check, message) {
        const self = this;
        return new (class extends ZodType {
            parse(data) {
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
        return new (class extends ZodType {
            parse(data) {
                if (data === undefined) {
                    return undefined;
                }
                return self.parse(data);
            }
        })();
    }
}
exports.ZodType = ZodType;
// String schema
class ZodString extends ZodType {
    parse(data) {
        if (typeof data !== 'string') {
            throw new Error('Expected string');
        }
        return data;
    }
    email() {
        return this.refine((data) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data), 'Invalid email');
    }
    min(minLength) {
        return this.refine((data) => data.length >= minLength, `Must be at least ${minLength} characters long`);
    }
    max(maxLength) {
        return this.refine((data) => data.length <= maxLength, `Must be at most ${maxLength} characters long`);
    }
}
// Number schema
class ZodNumber extends ZodType {
    parse(data) {
        if (typeof data !== 'number') {
            throw new Error('Expected number');
        }
        return data;
    }
    min(minLength) {
        return this.refine((data) => data >= minLength, `Must be at least ${minLength}`);
    }
    max(maxLength) {
        return this.refine((data) => data <= maxLength, `Must be at most ${maxLength}`);
    }
}
// Boolean schema
class ZodBoolean extends ZodType {
    parse(data) {
        if (typeof data !== 'boolean') {
            throw new Error('Expected boolean');
        }
        return data;
    }
}
// Date schema
class ZodDate extends ZodType {
    parse(data) {
        if (!(data instanceof Date)) {
            throw new Error('Expected date');
        }
        return data;
    }
}
// Enum schema
class ZodEnum extends ZodType {
    constructor(values) {
        super();
        this.values = values;
    }
    parse(data) {
        if (typeof data !== 'string' || !this.values.includes(data)) {
            throw new Error(`Expected one of: ${this.values.join(', ')}`);
        }
        return data;
    }
}
// Object schema
class ZodObject extends ZodType {
    constructor(shape) {
        super();
        this.shape = shape;
    }
    parse(data) {
        if (typeof data !== 'object' || data === null) {
            throw new Error('Expected object');
        }
        const result = {};
        for (const key in this.shape) {
            const validator = this.shape[key];
            result[key] = validator.parse(data[key]);
        }
        return result;
    }
}
// Array schema
class ZodArray extends ZodType {
    constructor(itemType) {
        super();
        this.itemType = itemType;
    }
    parse(data) {
        if (!Array.isArray(data)) {
            throw new Error('Expected array');
        }
        return data.map((item) => this.itemType.parse(item));
    }
}
// A utility object to create schemas easily
exports.z = {
    string: () => new ZodString(),
    number: () => new ZodNumber(),
    boolean: () => new ZodBoolean(),
    date: () => new ZodDate(),
    enum: (values) => new ZodEnum(values),
    object: (shape) => new ZodObject(shape),
    array: (itemType) => new ZodArray(itemType),
};
