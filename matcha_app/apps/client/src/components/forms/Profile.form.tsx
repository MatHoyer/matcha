import { closeGlobalDialog } from '@/hooks/use-dialog';
import { useSession } from '@/hooks/useSession';
import { useZodForm } from '@/hooks/useZodForm';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { defaultHandleSubmit } from '@/lib/fetch-utils/defaultHandleSubmit';
import {
  GENDERS,
  getTagsSchemas,
  getUrl,
  getUserLocationSchemas,
  ORIENTATIONS,
  TGender,
  TOrientation,
  TUpdateUserSchemas,
  updateUserSchemas,
} from '@matcha/common';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import GlobalLocationCombobox from '../comboxes/GlobalLocation.combobox';
import MultiTagCombobox from '../comboxes/Tag.combobox';
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
import { Textarea } from '../ui/textarea';
import { SubmitButtonForm } from './components/SubmitButton.form';
import { TFormProps } from './types.form';

type TForm = {
  name: string;
  lastName: string;
  email: string;
  gender: TGender;
  preference: TOrientation;
  birthDate: Date;
  biography: string | null | undefined;
  tags: string[];
  location: string;
};

export const ProfileForm: React.FC<
  TFormProps<TForm, TUpdateUserSchemas['response']>
> = ({ defaultValues, modal, getData, setIsLoading }) => {
  const session = useSession();

  const form = useZodForm<TForm>({
    schema: updateUserSchemas.requirements,
    defaultValues: {
      ...session!.user,
      biography: session!.user!.biography || '',
      tags: [],
      location: '',
      ...defaultValues,
    },
  });

  useQuery({
    queryKey: ['tags', session!.user!.id],
    queryFn: () =>
      axiosFetch({
        method: 'GET',
        url: getUrl('api-tags', {
          type: 'user',
          id: session!.user!.id,
        }),
        schemas: getTagsSchemas,
        handleEnding: {
          cb: (data) => {
            console.log(data);
            form.setValue(
              'tags',
              data.tags.map((tag) => tag.name)
            );
          },
        },
      }),
  });

  useQuery({
    queryKey: ['location', session!.user!.id],
    queryFn: () =>
      axiosFetch({
        method: 'GET',
        url: getUrl('api-location', {
          type: 'near/user',
          id: session!.user!.id,
        }),
        schemas: getUserLocationSchemas,
        handleEnding: {
          cb: (data) => {
            form.setValue('location', data.location.name);
          },
        },
      }),
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
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2 md:flex-row">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
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
            <FormItem className="flex-1">
              <FormLabel>Familly name</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="family-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{' '}
      </div>
      <div className="flex flex-col gap-2 md:flex-row">
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex-1">
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
            <FormItem className="flex-1">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} autoComplete="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
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
      <div className="flex flex-col gap-2 md:flex-row">
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <MultiTagCombobox {...field} modal={modal} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Location (update every days)</FormLabel>
              <FormControl>
                <GlobalLocationCombobox {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="biography"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Biography</FormLabel>
            <FormControl>
              <Textarea
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="mt-4" />
      <FormMessage>{form.formState.errors.root?.message}</FormMessage>
      <SubmitButtonForm modal={modal} isLoading={mutation.isPending}>
        Update profile
      </SubmitButtonForm>
    </Form>
  );
};
