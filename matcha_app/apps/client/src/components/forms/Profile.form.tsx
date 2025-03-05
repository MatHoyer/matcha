import { closeGlobalDialog } from '@/hooks/use-dialog';
import { useSession } from '@/hooks/useSession';
import { useZodForm } from '@/hooks/useZodForm';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { defaultHandleSubmit } from '@/lib/fetch-utils/defaultHandleSubmit';
import {
  GENDERS,
  getUrl,
  ORIENTATIONS,
  TGender,
  TOrientation,
  TUpdateUserSchemas,
  updateUserSchemas,
} from '@matcha/common';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { DatePicker } from '../ui/date-time-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import Selector from '../ui/selector';
import { SubmitButtonForm } from './components/SubmitButton.form';
import { TFormProps } from './types.form';

type TForm = {
  name: string;
  lastName: string;
  email: string;
  gender: TGender;
  preference: TOrientation;
  birthDate: Date;
};

export const ProfileForm: React.FC<
  TFormProps<TForm, TUpdateUserSchemas['response']>
> = ({ defaultValues: _, modal, getData, setIsLoading }) => {
  const session = useSession();
  const form = useZodForm<TForm>({
    schema: updateUserSchemas.requirements,
    defaultValues: {
      ...session!.user,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TForm) => {
      return await axiosFetch({
        method: 'PUT',
        url: getUrl('api-users', {
          id: session!.user!.id,
        }),
        data,
        schemas: updateUserSchemas,
        form,
        handleEnding: {
          successMessage: 'Profile updated',
          errorMessage: 'Error updating profile',
          cb: (data) => {
            if (modal) closeGlobalDialog();
            getData?.(data);
            session!.refetch();
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
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} autoComplete="name" />
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
              <Input {...field} autoComplete="family-name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Birth date</FormLabel>
            <FormControl>
              <DatePicker {...field} modal={modal} />
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
              <Input type="email" {...field} autoComplete="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-col gap-2 md:flex-row">
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="flex-1">
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
            <FormItem className="flex-1">
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
      </div>
      <FormMessage>{form.formState.errors.root?.message}</FormMessage>
      <SubmitButtonForm modal={modal} isLoading={mutation.isPending}>
        Update profile
      </SubmitButtonForm>
    </Form>
  );
};
