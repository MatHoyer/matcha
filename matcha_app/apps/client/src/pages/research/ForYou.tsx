import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from '@/components/pagination/Layout';
import { AppLoader } from '@/components/ui/loaders';
import { Typography } from '@/components/ui/typography';
import { useSession } from '@/hooks/useSession';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { getUrl } from '@matcha/common';
import { suggestUsersSchema } from '@matcha/common';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export const ForYou: React.FC = () => {
  const { user } = useSession();
  const id = user?.id;
  console.log('id in forYou :', id);
  //   const { data, isLoading } =
  useQuery({
    queryKey: ['suggestedProfiles'],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-search', {
          type: 'forYou',
          id: +id!,
        }),
        schemas: suggestUsersSchema,
        handleEnding: {
          cb: (data) => {
            console.log('data from useQuery suggesetedProfiles :', data);
          },
        },
      });
    },
  });

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>For you</LayoutTitle>
        <LayoutDescription>Profiles you might like</LayoutDescription>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-4">
        {/* {isLoading ? (
          <div className="flex justify-center items-center">
            <AppLoader size={60} />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {data?.users.length ? (
              data.users.map((gUser) => (
                <MatchRow key={gUser.user.id} gUser={gUser} />
              ))
            ) : (
              <Typography variant="small" className="text-center">
                No matches found.
              </Typography>
            )}
          </div>
        )} */}
      </LayoutContent>
    </Layout>
  );
};
