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
import NumberInput from '@/components/ui/NumberField';
import PasswordInput from '@/components/ui/password-input';
import Selector from '@/components/ui/selector';
import { Typography } from '@/components/ui/typography';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { GENDERS, getUrl, ORIENTATIONS, signupSchemas } from '@matcha/common';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type TForm = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  gender: 'Male' | 'Female';
  preference: 'Heterosexual' | 'Bisexual' | 'Homosexual';
};

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const form = useForm<TForm>({
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      password: '',
      age: 0,
      gender: 'Male',
      preference: 'Heterosexual',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TForm) => {
      return await axiosFetch({
        method: 'POST',
        url: getUrl('api-auth', { type: 'signup' }),
        data,
        config: {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
        schemas: signupSchemas,
        handleEnding: {
          successMessage: 'Signup successful',
          errorMessage: 'Signup failed',
          cb: () => {
            navigate('/');
          },
        },
      });
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const res = await mutation.mutateAsync(data);
    if (axios.isAxiosError(res)) {
      form.setError('root', {
        type: 'manual',
        message: res.response?.data.message,
      });
    }
  });

  return (
    <div className="size-full flex justify-center items-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>
            <Typography variant="h2">Sign up</Typography>
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
              {...form.register('name', {
                required: 'Name is required',
              })}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Jean" autoComplete="name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              {...form.register('lastName', {
                required: 'Lastname is required',
              })}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Familly name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Dupont"
                      autoComplete="family-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              {...form.register('email', {
                required: 'Email is required',
              })}
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
            <FormField
              control={form.control}
              {...form.register('age', {
                required: 'Age is required',
              })}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <NumberInput {...field} scale={0} step={1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              {...form.register('gender', {
                required: 'Gender is required',
              })}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Selector
                      list={[...GENDERS]}
                      value={field.value || 'Select gender'}
                      onChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              {...form.register('preference', {
                required: 'Orientation is required',
              })}
              name="preference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orientation</FormLabel>
                  <FormControl>
                    <Selector
                      list={[...ORIENTATIONS]}
                      value={field.value || 'Select orientation'}
                      onChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={mutation.isPending}>
              Sign up
            </LoadingButton>
            <div className="flex items-center gap-2 w-full justify-center">
              <Typography className="text-xs">Already register ?</Typography>
              <Typography
                variant="link"
                className="cursor-pointer text-xs"
                onClick={() =>
                  navigate(
                    getUrl('client-auth', {
                      type: 'login',
                    })
                  )
                }
              >
                Log in
              </Typography>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
