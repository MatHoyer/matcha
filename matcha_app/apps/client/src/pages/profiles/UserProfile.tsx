import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from '@/components/pagination/Layout';
import { Badge } from '@/components/ui/badge';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { getUrl, getUserSchemas } from '@matcha/common';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export const UserProfile = () => {
  const { id } = useParams();
  const userQuery = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!id) return null;
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-users', { id: +id }),
        schemas: getUserSchemas,
      });
    },
  });

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>
          {userQuery.data?.user.name} {userQuery.data?.user.lastName}
        </LayoutTitle>
        <LayoutDescription>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Badge>TODO</Badge>
            </div>
            {userQuery.data?.user.biography}
          </div>
        </LayoutDescription>
      </LayoutHeader>
      <LayoutContent>datas</LayoutContent>
    </Layout>
  );
};
