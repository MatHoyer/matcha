import { AdvancedSearchForm } from '@/components/forms/AdvancedSearch.form';
import { ImageContainer } from '@/components/images/ImageContainer';
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from '@/components/pagination/Layout';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { FameRating } from '@/components/ui/FameRating';
import { AppLoader } from '@/components/ui/loaders';
import { Typography } from '@/components/ui/typography';
import { TAdvancedSearchSchema } from '@matcha/common';
import { ChevronRight, MapPin, Mars, Venus } from 'lucide-react';
import { useState } from 'react';

const MatchRow: React.FC<{
  gUser: TAdvancedSearchSchema['response']['users'][number];
}> = ({ gUser }) => {
  return (
    <Card className="relative group w-full p-2 cursor-pointer">
      <div className="flex gap-2">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transform duration-500">
          <Typography variant="muted" className="flex items-center">
            See profile <ChevronRight />
          </Typography>
        </div>
        <ImageContainer
          size="sm"
          imageSrc={''}
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
                <Badge>{tag.name}</Badge>
              ))}
            </div>
            <Typography variant="small" className="font-normal">
              {gUser.user.biography}
            </Typography>
          </div>
          <div className="flex gap-2">
            <Typography variant="code" className="flex items-center gap-1">
              {gUser.user.gender === 'Male' ? <Mars /> : <Venus />}{' '}
              {gUser.user.gender}
            </Typography>
            <Typography variant="code" className="flex items-center">
              {gUser.user.age} years old
            </Typography>
            <Typography variant="code" className="flex gap-1 items-center">
              <MapPin size={16} />
              {gUser.location}
            </Typography>
            <div className="flex-1" />
            <FameRating note={1} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export const AdvancedSearch: React.FC = () => {
  const [users, setUsers] = useState<
    TAdvancedSearchSchema['response']['users'][number][]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Advanced search</LayoutTitle>
        <LayoutDescription>Search love with criterias</LayoutDescription>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-4">
        <AdvancedSearchForm
          getData={(data) => {
            setUsers(data.users);
          }}
          setIsLoading={setIsLoading}
        />
        {isLoading ? (
          <div className="flex justify-center items-center">
            <AppLoader size={60} />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {users.map((gUser) => (
              <MatchRow gUser={gUser} key={gUser.user.id} />
            ))}
          </div>
        )}
      </LayoutContent>
    </Layout>
  );
};
