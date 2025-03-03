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
import { Typography } from '@/components/ui/typography';
import { TAdvancedSearchSchema } from '@matcha/common';
import { MapPin } from 'lucide-react';
import { useState } from 'react';

const MatchRow: React.FC<{
  gUser: TAdvancedSearchSchema['response']['users'][number];
}> = ({ gUser }) => {
  return (
    <Card className="w-full p-2">
      <div className="flex gap-2">
        <div className="flex items-center gap-2">
          <ImageContainer
            size="sm"
            imageSrc={''}
            altImage="avatar"
            className="h-full"
          />
        </div>
        <div className="flex flex-col items-start justify-center flex-1">
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
        <div className="flex flex-col items-end gap-2">
          <FameRating note={1} />
          <div className="flex-1" />
          <Typography variant="code">
            <div className="flex gap-1 items-center">
              <MapPin size={16} />
              {gUser.location}
            </div>
          </Typography>
          <Typography variant="code">{gUser.user.age} years old</Typography>
        </div>
      </div>
    </Card>
  );
};

export const AdvancedSearch: React.FC = () => {
  const [users, setUsers] = useState<
    TAdvancedSearchSchema['response']['users'][number][]
  >([]);

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
        />
        <div className="flex flex-col gap-2">
          {users.map((gUser) => (
            <MatchRow gUser={gUser} key={gUser.user.id} />
          ))}
        </div>
      </LayoutContent>
    </Layout>
  );
};
