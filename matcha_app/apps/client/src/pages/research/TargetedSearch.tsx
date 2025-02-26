import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from '@/components/Layout';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { getTagsSchemas, getUrl } from '@matcha/common';
import { useQuery } from '@tanstack/react-query';

export const TargetedSearch: React.FC = () => {
  const query = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-tags'),
        schemas: getTagsSchemas,
      });
    },
    retry: false,
    refetchOnWindowFocus: true,
  });

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Advanced research</LayoutTitle>
        <LayoutDescription>Search love with criterias</LayoutDescription>
      </LayoutHeader>
      <LayoutContent>{JSON.stringify(query.data)}</LayoutContent>
    </Layout>
  );
};
