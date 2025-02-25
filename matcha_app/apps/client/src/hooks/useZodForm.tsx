import { ZodType } from '@matcha/common';
import { useEffect } from 'react';
import {
  FieldPath,
  FieldValues,
  useForm,
  UseFormProps,
  useWatch,
} from 'react-hook-form';

type UseZodFormProps<T extends FieldValues> = Exclude<
  UseFormProps<T>,
  'resolver'
> & {
  schema: ZodType<T>;
};

export const useZodForm = <T extends FieldValues>({
  schema,
  ...formProps
}: UseZodFormProps<T>) => {
  const form = useForm<T>({
    ...formProps,
  });

  const values = useWatch({ control: form.control });

  useEffect(() => {
    for (const field of Object.keys(values)) {
      form.clearErrors(field as FieldPath<T>);
    }
    const data = schema.safeParse(values);
    if (!data.success) {
      console.log('error', data.error);
      for (const field of data.error.fields) {
        const fieldName = field.field as FieldPath<T>;
        if (form.getFieldState(fieldName).isDirty) {
          form.setError(fieldName, {
            type: 'manual',
            message: field.message,
          });
        }
      }
    }
  }, [values]);

  return form;
};
