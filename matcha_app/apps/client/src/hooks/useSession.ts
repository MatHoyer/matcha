import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { getUrl, sessionSchemas } from '@matcha/common';
import { useQuery } from '@tanstack/react-query';

export const useSession = () => {
  const query = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-auth', { type: 'session' }),
        schemas: sessionSchemas,
      });
    },
    retry: false,
    refetchOnWindowFocus: true,
  });

  return { user: query.data?.user, loading: query.isLoading };
};
