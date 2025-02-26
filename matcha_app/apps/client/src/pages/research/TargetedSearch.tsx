import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from '@/components/pagination/Layout';
import TagCombobox from '@/components/ui/TagCombobox';

export const TargetedSearch: React.FC = () => {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Advanced research</LayoutTitle>
        <LayoutDescription>Search love with criterias</LayoutDescription>
      </LayoutHeader>
      <LayoutContent>
        <TagCombobox />
      </LayoutContent>
    </Layout>
  );
};
