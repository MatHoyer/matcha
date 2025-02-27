import { closeGlobalDialog } from '@/hooks/use-dialog';
import { useZodForm } from '@/hooks/useZodForm';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { defaultHandleSubmit } from '@/lib/fetch-utils/defaultHandleSubmit';
import { createTagSchemas, getUrl } from '@matcha/common';
import { useMutation } from '@tanstack/react-query';
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
  name: string;
};

export const CreateTagForm: React.FC<TFormProps<TForm>> = ({
  defaultValues,
  modal,
}) => {
  const form = useZodForm<TForm>({
    schema: createTagSchemas.requirements,
    defaultValues: {
      name: '',
      ...defaultValues,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TForm) => {
      return await axiosFetch({
        method: 'POST',
        url: getUrl('api-tags'),
        data,
        schemas: createTagSchemas,
        form,
        handleEnding: {
          successMessage: 'Tag created',
          errorMessage: 'Error creating tag',
          cb: () => {
            if (modal) closeGlobalDialog();
          },
        },
      });
    },
  });

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
      <FormMessage>{form.formState.errors.root?.message}</FormMessage>
      <SubmitButtonForm modal={modal} isLoading={mutation.isPending}>
        Create tag
      </SubmitButtonForm>
    </Form>
  );
};
