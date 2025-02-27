import { AdvancedSearchForm } from '@/components/forms/AdvancedSearch.form';
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from '@/components/pagination/Layout';

export const AdvancedSearch: React.FC = () => {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Advanced search</LayoutTitle>
        <LayoutDescription>Search love with criterias</LayoutDescription>
      </LayoutHeader>
      <LayoutContent>
        <AdvancedSearchForm />
      </LayoutContent>
    </Layout>
  );
};
