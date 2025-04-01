import { ImageContainer } from '@/components/images/ImageContainer';
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
} from '@/components/pagination/Layout';
import { Card } from '@/components/ui/card';
import { FameRating } from '@/components/ui/FameRating';
import { Typography } from '@/components/ui/typography';
import { useSession } from '@/hooks/useSession';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { TAdvancedSearchSchema } from '@matcha/common';
import { getUrl } from '@matcha/common';
import { suggestUsersSchema } from '@matcha/common';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, MapPin, Mars, Venus } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const MatchRow: React.FC<{
  gUser: TAdvancedSearchSchema['response']['users'][number];
}> = ({ gUser }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  return (
    <Card
      className="relative group w-full p-3 cursor-pointer"
      onClick={() =>
        navigate(
          getUrl('client-profile', {
            id: gUser.user.id,
          })
        )
      }
    >
      {/* <div className="flex items-stretch"> */}
      <div className="w-full flex justify-center">
        <ImageContainer
          imageSrc={file ? URL.createObjectURL(file) : null}
          altImage="avatar"
          className=" w-full"
        />
      </div>

      <div className="flex-1 flex flex-col gap-2 mt-4">
        <div className="flex-1 flex flex-col gap-2">
          <Typography variant="large" className="text-lg font-bold">
            {gUser.user.name} {gUser.user.lastName}
          </Typography>
          <div className="absolute right-2 ">
            <div className="relative opacity-0 group-hover:opacity-100 transform duration-500">
              <Typography variant="muted" className="flex items-center">
                See profile <ChevronRight />
              </Typography>
            </div>
          </div>
          <div className="flex gap-1">
            {gUser.tags.map((tag) => (
              <Badge key={tag.id}>{tag.name}</Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 w-full gap-1 mb-4">
          <div className="grid grid-cols-2 gap-1">
            <Typography variant="code" className="flex items-center gap-1">
              {gUser.user.gender === 'Male' ? <Mars /> : <Venus />}{' '}
              {gUser.user.gender}
            </Typography>
            <Typography variant="code" className="flex items-center">
              {gUser.user.preference}
            </Typography>
            <Typography variant="code" className="flex items-center">
              {gUser.user.age} years old
            </Typography>
            <Typography variant="code" className="flex gap-1 items-center">
              <MapPin size={16} />
              {gUser.location}
            </Typography>
            <div className="mt-3">
              <FameRating note={gUser.fame} />
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </Card>
  );
};

export const ForYou: React.FC = () => {
  const [users, setUsers] = useState<
    TAdvancedSearchSchema['response']['users'][number][]
  >([]);
  // const [filteredUsers, setFilteredUsers] = useState(users);
  const { user } = useSession();
  const id = user?.id;

  useQuery({
    queryKey: ['suggestedProfiles', id],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-search', {
          type: 'forYou',
          id,
        }),
        schemas: suggestUsersSchema,
        handleEnding: {
          cb: (data) => {
            setUsers(data.users);
            // setFilteredUsers(data.users);
          },
        },
      });
    },
  });

  return (
    <Layout>
      <LayoutHeader>
        <div className="layout-title">For you</div>
        <LayoutDescription>Profiles you might like</LayoutDescription>
      </LayoutHeader>

      <LayoutContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {users.map((gUser) => (
          <MatchRow key={gUser.user.id} gUser={gUser} />
        ))}
      </LayoutContent>
    </Layout>
  );
};
