import { ImageContainer } from '@/components/images/ImageContainer';
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from '@/components/pagination/Layout';
import { Card } from '@/components/ui/card';
import { FameRating } from '@/components/ui/FameRating';
import { AppLoader } from '@/components/ui/loaders';
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
import { useNavigate, useParams } from 'react-router-dom';

export const MatchRow: React.FC<{
  gUser: TAdvancedSearchSchema['response']['users'][number];
}> = ({ gUser }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  return (
    <Card
      className="relative group w-full p-2 cursor-pointer"
      onClick={() =>
        navigate(
          getUrl('client-profile', {
            id: gUser.user.id,
          })
        )
      }
    >
      <div className="flex gap-2">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transform duration-500">
          <Typography variant="muted" className="flex items-center">
            See profile <ChevronRight />
          </Typography>
        </div>
        <ImageContainer
          size="sm"
          imageSrc={file ? URL.createObjectURL(file) : null}
          altImage="avatar"
          className="h-full"
        />
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex-1 flex flex-col gap-2">
            <Typography variant="large" className="text-lg font-bold">
              {gUser.user.name} {gUser.user.lastName}
            </Typography>
            <div className="flex gap-1">
              {gUser.tags.map((tag) => (
                <Badge key={tag.id}>{tag.name}</Badge>
              ))}
            </div>
            <Typography variant="small" className="font-normal">
              {gUser.user.biography}
            </Typography>
          </div>
          <div className="grid grid-cols-2 md:flex gap-2">
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
            <div className="flex-1" />
            <FameRating note={gUser.fame} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export const ForYou: React.FC = () => {
  const [users, setUsers] = useState<
    TAdvancedSearchSchema['response']['users'][number][]
  >([]);
  const { user } = useSession();
  const id = user?.id;
  if (!id) return null;
  const [isLoading, setIsLoading] = useState(false);

  useQuery({
    queryKey: ['suggestedProfiles'],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-search', {
          type: 'forYou',
          id: id,
        }),
        schemas: suggestUsersSchema,
        handleEnding: {
          cb: (data) => {
            console.log(`data :`, data);
            setUsers(data.users);
          },
        },
      });
    },
  });

  console.log(`users : ${users}`);

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>For you</LayoutTitle>
        <LayoutDescription>Profiles you might like</LayoutDescription>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {users.map((gUser) => (
            <MatchRow key={gUser.user.id} gUser={gUser} />
          ))}
        </div>
      </LayoutContent>
    </Layout>
  );
};
