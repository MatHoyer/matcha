import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import NumberInput from '@/components/ui/NumberField';
import PasswordInput from '@/components/ui/password-input';
import Selector from '@/components/ui/selector';
import { closeGlobalDialog } from '@/hooks/use-dialog';
import { useZodForm } from '@/hooks/useZodForm';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import {
  GENDERS,
  getUrl,
  Infer,
  ORIENTATIONS,
  signupSchemas,
} from '@matcha/common';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SubmitButtonForm } from './components/SubmitButton.form';
import { TFormProps } from './types.form';

type TForm = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  gender: 'Male' | 'Female' | null;
  preference: 'Heterosexual' | 'Bisexual' | 'Homosexual' | null;
};

const SignupForm: React.FC<TFormProps<TForm>> = ({
  defaultValues,
  modal = false,
}) => {
  const navigate = useNavigate();

  const form = useZodForm<TForm>({
    schema: signupSchemas.requirements,
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      password: '',
      age: 0,
      gender: null,
      preference: null,
      ...defaultValues,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: Infer<typeof signupSchemas.requirements>) => {
      return await axiosFetch({
        method: 'POST',
        url: getUrl('api-auth', { type: 'signup' }),
        data: data,
        schemas: signupSchemas,
        form,
        handleEnding: {
          successMessage: 'Signup successful',
          errorMessage: 'Signup failed',
          cb: () => {
            if (modal) closeGlobalDialog();
            navigate('/');
          },
        },
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data as Infer<typeof signupSchemas.requirements>, {
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
            <FormMessage />
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
      <FormField
        control={form.control}
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age</FormLabel>
            <FormControl>
              <NumberInput {...field} scale={0} step={1} min={0} />
            </FormControl>
            <FormMessage />
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
                modal={modal}
              />
            </FormControl>
            <FormMessage />
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
                modal={modal}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormMessage>{form.formState.errors.root?.message}</FormMessage>
      <SubmitButtonForm modal={modal} isLoading={mutation.isPending}>
        Signup
      </SubmitButtonForm>
    </Form>
  );
};

export default SignupForm;
