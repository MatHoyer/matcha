import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import PasswordInput from '@/components/ui/password-input';
import { closeGlobalDialog } from '@/hooks/use-dialog';
import { useZodForm } from '@/hooks/useZodForm';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { defaultHandleSubmit } from '@/lib/fetch-utils/defaultHandleSubmit';
import {
  getUrl,
  resetPasswordSchemas,
  TResetPasswordSchemas,
} from '@matcha/common';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SubmitButtonForm } from './components/SubmitButton.form';
import { TFormProps } from './types.form';

type TForm = {
  password: string;
};

const ResetPasswordForm: React.FC<
  TFormProps<TForm, TResetPasswordSchemas['response']>
> = ({ defaultValues, modal = false, getData, setIsLoading }) => {
  const navigate = useNavigate();
  const { token } = useParams();

  const form = useZodForm<TForm>({
    schema: resetPasswordSchemas.requirements,
    defaultValues: {
      password: '',
      ...defaultValues,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TForm) => {
      return await axiosFetch({
        method: 'POST',
        url: `${getUrl('api-users', { type: 'reset-password' })}/${token}`,
        data,
        schemas: resetPasswordSchemas,
        form,
        handleEnding: {
          successMessage: 'Password changed',
          errorMessage: 'Password change failed',
          cb: (data) => {
            if (modal) closeGlobalDialog();
            getData?.(data);
            navigate(getUrl('client-home'));
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
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>New password</FormLabel>
            <FormControl>
              <PasswordInput {...field} autoComplete="current-password" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormMessage>{form.formState.errors.root?.message}</FormMessage>
      <SubmitButtonForm modal={modal} isLoading={mutation.isPending}>
        Change password
      </SubmitButtonForm>
    </Form>
  );
};

export default ResetPasswordForm;
