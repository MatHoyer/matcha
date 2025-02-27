import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { closeGlobalDialog } from '@/hooks/use-dialog';
import { useZodForm } from '@/hooks/useZodForm';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { defaultHandleSubmit } from '@/lib/fetch-utils/defaultHandleSubmit';
import { getUrl, loginSchemas } from '@matcha/common';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { SubmitButtonForm } from './components/SubmitButton.form';
import { TFormProps } from './types.form';

type TForm = {
  email: string;
  password: string;
};

const LoginForm: React.FC<TFormProps<TForm>> = ({
  defaultValues,
  modal = false,
}) => {
  const navigate = useNavigate();

  const form = useZodForm<TForm>({
    schema: loginSchemas.requirements,
    defaultValues: {
      email: '',
      password: '',
      ...defaultValues,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TForm) => {
      return await axiosFetch({
        method: 'POST',
        url: getUrl('api-auth', { type: 'login' }),
        data,
        schemas: loginSchemas,
        form,
        handleEnding: {
          successMessage: 'Login successful',
          errorMessage: 'Login failed',
          cb: () => {
            if (modal) closeGlobalDialog();
            navigate('/');
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
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                placeholder="example@domain.com"
                autoComplete="email"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <PasswordInput {...field} autoComplete="current-password" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormMessage>{form.formState.errors.root?.message}</FormMessage>
      <SubmitButtonForm modal={modal} isLoading={mutation.isPending}>
        Login
      </SubmitButtonForm>
    </Form>
  );
};

export default LoginForm;
