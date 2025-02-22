import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loaders';
import PasswordInput from '@/components/ui/password-input';
import { Typography } from '@/components/ui/typography';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { getUrl } from '@matcha/common';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type TForm = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const form = useForm<TForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TForm) => {
      await axiosFetch({
        method: 'post',
        url: getUrl('api-auth', { type: 'login' }),
        data,
        config: {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
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
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error(error);
    }
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
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={form.formState.isLoading}>
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
