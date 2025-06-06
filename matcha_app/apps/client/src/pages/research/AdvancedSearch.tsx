import { AdvancedSearchForm } from '@/components/forms/AdvancedSearch.form';
import { ImageContainer } from '@/components/images/ImageContainer';
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
} from '@/components/pagination/Layout';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MultiCombobox } from '@/components/ui/combobox';
import { FameRating } from '@/components/ui/FameRating';
import { FilterToggle } from '@/components/ui/FilterToggle';
import { AppLoader } from '@/components/ui/loaders';
import { Typography } from '@/components/ui/typography';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import {
  GENDERS,
  getProfilePictureSchemas,
  getUrl,
  ORIENTATIONS,
  TAdvancedSearchSchema,
  TGender,
  TOrientation,
} from '@matcha/common';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, MapPin, Mars, Venus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MatchRow: React.FC<{
  gUser: TAdvancedSearchSchema['response']['users'][number];
}> = ({ gUser }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  useQuery({
    queryKey: [`picture-search`, gUser.user.id],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        schemas: getProfilePictureSchemas,
        url: getUrl('api-picture', {
          type: 'user-pp',
          id: gUser.user.id,
        }),
        handleEnding: {
          cb: (data) => {
            const uint8Array = new Uint8Array(data.picture.file.buffer);
            const file = new File([uint8Array], data.picture.file.name, {
              type: data.picture.file.type,
            });
            setFile(file);
          },
        },
      });
    },
  });

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

export const AdvancedSearch: React.FC = () => {
  const [users, setUsers] = useState<
    TAdvancedSearchSchema['response']['users'][number][]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [genderFilter, setGenderFilter] = useState<TGender[] | null>([]);
  const [preferenceFilter, setPreferenceFilter] = useState<
    TOrientation[] | null
  >([]);
  const [ageFilter, setAgeFilter] = useState<{
    order: 'asc' | 'desc';
    isActive: boolean;
  }>({ order: 'asc', isActive: false });
  const [fameFilter, setFameFilter] = useState<{
    order: 'asc' | 'desc';
    isActive: boolean;
  }>({ order: 'asc', isActive: false });

  return (
    <Layout>
      <LayoutHeader>
        <div className="layout-title">Advanced search</div>
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
        ) : users.length > 0 ? (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <div className="flex gap-2 w-full">
                <MultiCombobox
                  name="gender"
                  list={GENDERS.map((gender) => ({
                    value: gender,
                    label: gender,
                  }))}
                  value={genderFilter}
                  onChange={setGenderFilter}
                />
                <MultiCombobox
                  name="preference"
                  list={ORIENTATIONS.map((orientation) => ({
                    value: orientation,
                    label: orientation,
                  }))}
                  value={preferenceFilter}
                  onChange={setPreferenceFilter}
                />
              </div>
              <div className="flex gap-2">
                <FilterToggle
                  label="Age"
                  order={ageFilter.order}
                  toggleOrder={() =>
                    setAgeFilter((prev) => ({
                      ...prev,
                      order: prev.order === 'asc' ? 'desc' : 'asc',
                    }))
                  }
                  isActive={ageFilter.isActive}
                  toggleActive={() =>
                    setAgeFilter((prev) => ({
                      ...prev,
                      isActive: !prev.isActive,
                    }))
                  }
                />
                <FilterToggle
                  label="Fame"
                  order={fameFilter.order}
                  toggleOrder={() =>
                    setFameFilter((prev) => ({
                      ...prev,
                      order: prev.order === 'asc' ? 'desc' : 'asc',
                    }))
                  }
                  isActive={fameFilter.isActive}
                  toggleActive={() =>
                    setFameFilter((prev) => ({
                      ...prev,
                      isActive: !prev.isActive,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {users
                .filter((user) => {
                  return (
                    (genderFilter?.includes(user.user.gender) ||
                      !genderFilter ||
                      genderFilter.length === 0) &&
                    (preferenceFilter?.includes(user.user.preference) ||
                      !preferenceFilter ||
                      preferenceFilter.length === 0)
                  );
                })
                .sort((a, b) => {
                  if (!ageFilter.isActive && !fameFilter.isActive) {
                    return 0;
                  }

                  const activeCriteria = [];
                  if (ageFilter.isActive) {
                    activeCriteria.push({
                      value: a.user.age - b.user.age,
                      order: ageFilter.order === 'asc' ? 1 : -1,
                    });
                  }
                  if (fameFilter.isActive) {
                    activeCriteria.push({
                      value: a.fame - b.fame,
                      order: fameFilter.order === 'asc' ? 1 : -1,
                    });
                  }

                  for (const criterion of activeCriteria) {
                    if (criterion.value !== 0) {
                      return criterion.value * criterion.order;
                    }
                  }
                  return 0;
                })
                .map((gUser) => (
                  <MatchRow key={gUser.user.id} gUser={gUser} />
                ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <Typography variant="muted">No users found</Typography>
          </div>
        )}
      </LayoutContent>
    </Layout>
  );
};
