import { ZodType } from '@matcha/common';
import { FieldValues, Resolver, useForm, UseFormProps } from 'react-hook-form';

type UseZodFormProps<T extends FieldValues> = Exclude<
  UseFormProps<T>,
  'resolver'
> & {
  schema: ZodType<T>;
};

const zodResolver =
  <T extends FieldValues>(schema: ZodType<T>): Resolver<T> =>
  (values) => {
    const parsed = schema.safeParse(values);
    if (parsed.success) {
      return { errors: {}, values: parsed.data };
    }

    return {
      errors: parsed.error.fields.reduce(
        (acc, fieldError) => ({
          ...acc,
          [fieldError.field]: { message: fieldError.message },
        }),
        {} as FieldValues
      ),
      values: {},
    };
  };

export const useZodForm = <T extends FieldValues>({
  schema,
  ...formProps
}: UseZodFormProps<T>) => {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    ...formProps,
  });

  return form;
};
