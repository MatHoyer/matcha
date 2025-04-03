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
import { GENDERS, ORIENTATIONS, TAdvancedSearchSchema } from '@matcha/common';
import { getUrl } from '@matcha/common';
import { suggestUsersSchema } from '@matcha/common';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ChevronRight, MapPin, Mars, Venus } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TGender } from '@matcha/common';
import { TOrientation } from '@matcha/common';
import { MultiCombobox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { Label } from '@/components/ui/label';
import NumberInput from '@/components/ui/NumberField';
import { Controller } from 'react-hook-form';
import { TSuggestUsersSchema } from '@matcha/common';
import { FilterToggle } from '../../components/ui/FilterToggle';

export const MatchRow: React.FC<{
  gUser: TSuggestUsersSchema['response']['users'][number];
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
            {gUser.tags.names.map((tag) => (
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
              {gUser.location.name}
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
    TSuggestUsersSchema['response']['users'][number][]
  >([]);
  // const [filteredUsers, setFilteredUsers] = useState(users);
  const { user } = useSession();
  const id = user?.id;

  const [genderFilter, setGenderFilter] = useState<TGender[] | null>([]);
  const [preferenceFilter, setPreferenceFilter] = useState<
    TOrientation[] | null
  >([]);
  const [ageOrder, setAgeOrder] = useState<{
    order: 'asc' | 'desc';
    isActive: boolean;
  }>({ order: 'asc', isActive: false });
  const [fameOrder, setFameOrder] = useState<{
    order: 'asc' | 'desc';
    isActive: boolean;
  }>({ order: 'asc', isActive: false });
  const [tagOrder, setTagOrder] = useState<{
    order: 'asc' | 'desc';
    isActive: boolean;
  }>({ order: 'asc', isActive: false });
  const [locationOrder, setLocationOrder] = useState<{
    order: 'asc' | 'desc';
    isActive: boolean;
  }>({ order: 'asc', isActive: false });

  // const [ageOrder, setAgeOrder] = useState<'asc' | 'desc'>('asc');
  // const [fameOrder, setFameOrder] = useState<'asc' | 'desc'>('asc');
  // const [distanceOrder, setDistanceOrder] = useState<'asc' | 'desc'>('asc');
  // const [tagsOrder, setTagsOrder] = useState<'asc' | 'desc'>('asc');

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

      <LayoutContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 w-full items-center">
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
            {/* <div className="flex gap-2"> */}
            {/* </div> */}
            <FilterToggle
              label="Age"
              order={ageOrder.order}
              toggleOrder={() =>
                setAgeOrder((prev) => ({
                  ...prev,
                  order: prev.order === 'asc' ? 'desc' : 'asc',
                }))
              }
              isActive={ageOrder.isActive}
              toggleActive={() =>
                setAgeOrder((prev) => ({
                  ...prev,
                  isActive: !prev.isActive,
                }))
              }
            />
            <FilterToggle
              label="Fame"
              order={fameOrder.order}
              toggleOrder={() =>
                setFameOrder((prev) => ({
                  ...prev,
                  order: prev.order === 'asc' ? 'desc' : 'asc',
                }))
              }
              isActive={fameOrder.isActive}
              toggleActive={() =>
                setFameOrder((prev) => ({
                  ...prev,
                  isActive: !prev.isActive,
                }))
              }
            />
            <FilterToggle
              label="Tag"
              order={tagOrder.order}
              toggleOrder={() =>
                setTagOrder((prev) => ({
                  ...prev,
                  order: prev.order === 'asc' ? 'desc' : 'asc',
                }))
              }
              isActive={tagOrder.isActive}
              toggleActive={() =>
                setTagOrder((prev) => ({
                  ...prev,
                  isActive: !prev.isActive,
                }))
              }
            />
            <FilterToggle
              label="Location"
              order={locationOrder.order}
              toggleOrder={() =>
                setLocationOrder((prev) => ({
                  ...prev,
                  order: prev.order === 'asc' ? 'desc' : 'asc',
                }))
              }
              isActive={locationOrder.isActive}
              toggleActive={() =>
                setLocationOrder((prev) => ({
                  ...prev,
                  isActive: !prev.isActive,
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
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
                const activeCriteria = [];
                if (ageOrder.isActive) {
                  activeCriteria.push({
                    value: a.user.age - b.user.age,
                    order: ageOrder.order === 'asc' ? 1 : -1,
                  });
                }
                if (fameOrder.isActive) {
                  activeCriteria.push({
                    value: a.fame - b.fame,
                    order: fameOrder.order === 'asc' ? 1 : -1,
                  });
                }
                if (tagOrder.isActive) {
                  activeCriteria.push({
                    value: a.tags.order - b.tags.order,
                    order: tagOrder.order === 'asc' ? 1 : -1,
                  });
                }
                if (locationOrder.isActive) {
                  activeCriteria.push({
                    value: a.location.order - b.location.order,
                    order: locationOrder.order === 'asc' ? 1 : -1,
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
      </LayoutContent>
    </Layout>
  );
};
{
  /* {users.map((gUser) => (
          <MatchRow key={gUser.user.id} gUser={gUser} />
        ))} */
}
