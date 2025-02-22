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
import NumberInput from '@/components/ui/NumberField';
import PasswordInput from '@/components/ui/password-input';
import Selector from '@/components/ui/selector';
import { Typography } from '@/components/ui/typography';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { GENDERS, getUrl, ORIENTATIONS } from '@matcha/common';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type TForm = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  gender: 'Male' | 'Female' | null;
  preference: 'Heterosexual' | 'Bisexual' | 'Homosexual' | null;
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
      gender: null,
      preference: null,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TForm) => {
      await axiosFetch({
        method: 'post',
        url: getUrl('api-auth', { type: 'signup' }),
        data,
        config: {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
        handleEnding: {
          successMessage: 'Signup successful',
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Jean" autoComplete="name" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
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
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <NumberInput {...field} scale={0} step={1} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
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
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
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
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={form.formState.isLoading}>
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
