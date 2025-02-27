import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { default as MultiTagCombobox } from '@/components/ui/TagCombobox';
import { openGlobalDialog } from '@/hooks/use-dialog';
import { useSession } from '@/hooks/useSession';
import { useZodForm } from '@/hooks/useZodForm';
import { targetedSearchSchema } from '@matcha/common';
import { Plus, Search } from 'lucide-react';
import { Button } from '../ui/button';
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

export const AdvancedSearchForm: React.FC<TFormProps<TForm>> = ({
  defaultValues,
  modal,
}) => {
  const session = useSession();
  const form = useZodForm<TForm>({
    schema: targetedSearchSchema.requirements,
    defaultValues: {
      ages: {
        min: session.user!.age,
        max: session.user!.age,
      },
      fame: 0,
      location: '',
      tags: [],
      ...defaultValues,
    },
  });

  const onSubmit = () => {
    console.log(form.getValues());
  };

  return (
    <Form
      form={form}
      onSubmit={() => onSubmit()}
      className="flex flex-col gap-2"
    >
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <MultiTagCombobox {...field} />
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
