import { closeGlobalDialog } from '@/hooks/use-dialog';
import { useZodForm } from '@/hooks/useZodForm';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { defaultHandleSubmit } from '@/lib/fetch-utils/defaultHandleSubmit';
import {
  getUrl,
  getUserSchemas,
  TUpdateUserSchemas,
  updateUserSchemas,
} from '@matcha/common';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { SubmitButtonForm } from './components/SubmitButton.form';
import { TFormProps } from './types.form';

type TForm = {
  name?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  preference?: string;
  age?: number;
};

export const ProfileForm: React.FC<
  TFormProps<TForm, TUpdateUserSchemas['response']>
> = ({ defaultValues, modal, getData, setIsLoading }) => {
  const form = useZodForm<TForm>({
    schema: updateUserSchemas.requirements,
    defaultValues: {
      ...defaultValues,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TForm) => {
      return await axiosFetch({
        method: 'POST',
        url: getUrl('api-users'),
        data,
        schemas: getUserSchemas,
        form,
        handleEnding: {
          successMessage: 'Tag created',
          errorMessage: 'Error creating tag',
          cb: (data) => {
            if (modal) closeGlobalDialog();
            getData?.(data);
          },
        },
      });
    },
  });

  useEffect(() => {
    setIsLoading?.(mutation.isPending);
  }, [mutation.isPending]);

  const onSubmit = defaultHandleSubmit(form, mutation);

  return (
    <Form
      form={form}
      onSubmit={() => onSubmit()}
      className="flex flex-col gap-2"
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormMessage>{form.formState.errors.root?.message}</FormMessage>
      <SubmitButtonForm modal={modal} isLoading={mutation.isPending}>
        Update profile
      </SubmitButtonForm>
    </Form>
  );
};
