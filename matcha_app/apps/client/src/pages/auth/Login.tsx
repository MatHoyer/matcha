import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loaders';
import PasswordInput from '@/components/ui/password-input';
import { Typography } from '@/components/ui/typography';
import { useZodForm } from '@/hooks/useZodForm';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { getUrl, loginSchemas } from '@matcha/common';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type TForm = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const form = useZodForm<TForm>({
    schema: loginSchemas.requirements,
    defaultValues: {
      email: '',
      password: '',
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
            navigate('/');
          },
        },
      });
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    mutation.mutate(data, {
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          form.setError('root', {
            type: 'manual',
            message: error.response?.data.message,
          });
        }
      },
    });
  });

  return (
    <div className="size-full flex justify-center items-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>
            <Typography variant="h2">Login</Typography>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            form={form}
            onSubmit={() => onSubmit()}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              {...form.register('email', { required: 'Email is required' })}
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
              {...form.register('password', {
                required: 'Password is required',
              })}
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
            <LoadingButton type="submit" loading={mutation.isPending}>
              Login
            </LoadingButton>
            <div className="flex items-center gap-2 w-full justify-center">
              <Typography className="text-xs">New here ?</Typography>
              <Typography
                variant="link"
                className="cursor-pointer text-xs"
                onClick={() =>
                  navigate(
                    getUrl('client-auth', {
                      type: 'signup',
                    })
                  )
                }
              >
                Create an account
              </Typography>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
