type TFieldError = {
  field: string;
  message: string;
};

type TErrorSchema = {
  fields: TFieldError[];
  message: string;
};

export class SchemaError extends Error {
  fields: TFieldError[];

  constructor(data: TErrorSchema) {
    super(data.message);
    this.fields = data.fields;
  }
}
