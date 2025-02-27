import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from '@/components/pagination/Layout';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { LoadingButton } from '@/components/ui/loaders';
import { default as MultiTagCombobox } from '@/components/ui/TagCombobox';
import { useSession } from '@/hooks/useSession';
import { useZodForm } from '@/hooks/useZodForm';
import { targetedSearchSchema } from '@matcha/common';

type TForm = {
  ages: {
    min: number;
    max: number;
  };
  fame: number;
  location: string;
  tags: string[];
};

export const TargetedSearch: React.FC = () => {
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
    },
  });

  const onSubmit = () => {
    console.log(form.getValues());
  };

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Advanced research</LayoutTitle>
        <LayoutDescription>Search love with criterias</LayoutDescription>
      </LayoutHeader>
      <LayoutContent>
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
                  <MultiTagCombobox {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormMessage>{form.formState.errors.root?.message}</FormMessage>
          <LoadingButton type="submit" loading={false}>
            Rechercher
          </LoadingButton>
        </Form>
      </LayoutContent>
    </Layout>
  );
};
