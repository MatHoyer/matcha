import { closeGlobalDialog } from '@/hooks/use-dialog';
import { useZodForm } from '@/hooks/useZodForm';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { defaultHandleSubmit } from '@/lib/fetch-utils/defaultHandleSubmit';
import {
  blockUserSchemas,
  getUrl,
  reportUserSchemas,
  TCreateTagSchemas,
  z,
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
import { Switch } from '../ui/switch';
import { SubmitButtonForm } from './components/SubmitButton.form';
import { TFormProps } from './types.form';

type TForm = {
  reason: string;
  wantBlock: boolean;
};

export const ReportUserForm: React.FC<
  TFormProps<TForm, TCreateTagSchemas['response']> & {
    userId: number;
  }
> = ({ defaultValues, modal, getData, setIsLoading, userId }) => {
  const form = useZodForm<TForm>({
    schema: z.object({
      reason: reportUserSchemas.requirements.shape.reason,
      wantBlock: z.boolean(),
    }),
    defaultValues: {
      reason: '',
      wantBlock: false,
      ...defaultValues,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TForm) => {
      if (data.wantBlock) {
        await axiosFetch({
          method: 'POST',
          url: getUrl('api-block'),
          data: {
            userId,
          },
          schemas: blockUserSchemas,
        });
      }
      return await axiosFetch({
        method: 'POST',
        url: getUrl('api-report', {
          userId,
        }),
        data: {
          reason: data.reason,
        },
        schemas: reportUserSchemas,
        handleEnding: {
          successMessage: 'User reported',
          errorMessage: 'Error reporting user',
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
        name="reason"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reason</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="wantBlock"
        render={({ field }) => (
          <FormItem className="flex items-center gap-2">
            <FormLabel>Block user</FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormMessage>{form.formState.errors.root?.message}</FormMessage>
      <SubmitButtonForm modal={modal} isLoading={mutation.isPending}>
        Report user
      </SubmitButtonForm>
    </Form>
  );
};
