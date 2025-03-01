import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { closeGlobalDialog, openGlobalDialog } from '@/hooks/use-dialog';
import { useSession } from '@/hooks/useSession';
import { useZodForm } from '@/hooks/useZodForm';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { defaultHandleSubmit } from '@/lib/fetch-utils/defaultHandleSubmit';
import {
  advancedSearchSchema,
  getUrl,
  TAdvancedSearchSchema,
} from '@matcha/common';
import { useMutation } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { default as GlobalLocationCombobox } from '../comboxes/GlobalLocation.combobox';
import MultiTagCombobox from '../comboxes/Tag.combobox';
import { Button } from '../ui/button';
import { FameSlider } from '../ui/FameRating';
import { Label } from '../ui/label';
import NumberInput from '../ui/NumberField';
import { Typography } from '../ui/typography';
import { SubmitButtonForm } from './components/SubmitButton.form';
import { TFormProps } from './types.form';

type TForm = {
  ages: {
    min: number;
    max: number;
  };
  fame: number;
  location: string;
  tags: string[];
};

export const AdvancedSearchForm: React.FC<
  TFormProps<TForm, TAdvancedSearchSchema['response']>
> = ({ defaultValues, modal, getData }) => {
  const session = useSession();
  const form = useZodForm<TForm>({
    schema: advancedSearchSchema.requirements,
    defaultValues: {
      ages: {
        min: session.user!.age,
        max: session.user!.age,
      },
      fame: 1,
      location: '',
      tags: [],
      ...defaultValues,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TForm) => {
      return await axiosFetch({
        method: 'POST',
        url: getUrl('api-search', { type: 'advancedSearch' }),
        data,
        schemas: advancedSearchSchema,
        form,
        handleEnding: {
          errorMessage: 'Error searching',
          successMessage: 'Search successful',
          cb: (data) => {
            if (modal) closeGlobalDialog();
            getData?.(data);
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
        name="ages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <div className="flex flex-col gap-2 w-full">
                  <Label htmlFor="min-age">
                    <Typography variant="muted">Minimum</Typography>
                  </Label>
                  <NumberInput
                    id="min-age"
                    min={18}
                    scale={0}
                    step={1}
                    value={field.value.min}
                    onChange={(value) =>
                      field.onChange({ ...field.value, min: value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Label htmlFor="max-age">
                    <Typography variant="muted">Maximum</Typography>
                  </Label>
                  <NumberInput
                    id="max-age"
                    min={18}
                    scale={0}
                    step={1}
                    value={field.value.max}
                    onChange={(value) =>
                      field.onChange({ ...field.value, max: value })
                    }
                  />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="fame"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fame</FormLabel>
            <FormControl>
              <FameSlider {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <GlobalLocationCombobox {...field} modal={modal} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <MultiTagCombobox {...field} modal={modal} />
                <Button
                  onClick={() => {
                    openGlobalDialog('create-tag');
                  }}
                >
                  <Typography variant="small">Create a tag</Typography>
                  <Plus />
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormMessage>{form.formState.errors.root?.message}</FormMessage>
      <SubmitButtonForm modal={modal} isLoading={false}>
        <Search />
        <Typography>Search</Typography>
      </SubmitButtonForm>
    </Form>
  );
};
