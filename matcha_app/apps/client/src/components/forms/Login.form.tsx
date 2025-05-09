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
import { socket } from '@/lib/socket';
import { getUrl, loginSchemas, TLoginSchemas } from '@matcha/common';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SubmitButtonForm } from './components/SubmitButton.form';
import { TFormProps } from './types.form';

type TForm = {
  username: string;
  password: string;
};

const LoginForm: React.FC<TFormProps<TForm, TLoginSchemas['response']>> = ({
  defaultValues,
  modal = false,
  getData,
  setIsLoading,
}) => {
  const navigate = useNavigate();

  const form = useZodForm<TForm>({
    schema: loginSchemas.requirements,
    defaultValues: {
      username: '',
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
          cb: (data) => {
            if (modal) closeGlobalDialog();
            getData?.(data);
            socket.disconnect();
            socket.connect();
            if (data.resendToken) {
              navigate(
                getUrl('client-auth', {
                  type: 'wait-confirm',
                  urlParams: {
                    token: data.resendToken,
                  },
                })
              );
              toast.info('Please confirm your account');
              return;
            }
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
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input {...field} autoComplete="username" />
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
      <div className="mb-2"></div>
      <SubmitButtonForm modal={modal} isLoading={mutation.isPending}>
        Login
      </SubmitButtonForm>
    </Form>
  );
};

export default LoginForm;
