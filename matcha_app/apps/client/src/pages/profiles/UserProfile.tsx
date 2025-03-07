import { ImageContainer } from '@/components/images/ImageContainer';
import {
  Layout,
  LayoutContent,
  LayoutHeader,
} from '@/components/pagination/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import {
  getPicturesSchemas,
  getUrl,
  getUserSchemas,
  TTag,
} from '@matcha/common';
import { useQuery } from '@tanstack/react-query';
import { Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserTagsSchemas } from '../../../../common/src/schemas/api/tags.schema';

export const UserProfile = () => {
  const { id } = useParams();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [pictures, setPictures] = useState<File[]>([]);
  const [tags, setTags] = useState<TTag[]>([]);

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

  useQuery({
    queryKey: ['images-profile', 'profile', id],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-picture', {
          type: 'user',
          id: +id!,
        }),
        schemas: getPicturesSchemas,
        handleEnding: {
          cb: (data) => {
            const uint8Array = new Uint8Array(data.pictures[0].file.buffer);
            const file = new File([uint8Array], data.pictures[0].file.name, {
              type: data.pictures[0].file.type,
            });
            setProfilePicture(file);
            setPictures(
              data.pictures.map((picture) => {
                const uint8Array = new Uint8Array(picture.file.buffer);
                return new File([uint8Array], picture.file.name, {
                  type: picture.file.type,
                });
              })
            );
          },
        },
      });
    },
  });

  useQuery({
    queryKey: ['tags', id],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-tags', {
          type: 'user',
          id: +id!,
        }),
        schemas: getUserTagsSchemas,
        handleEnding: {
          cb: (data) => {
            setTags(data.tags);
          },
        },
      });
    },
  });

  return (
    <Layout>
      <LayoutHeader>
        <div className="flex gap-5 w-full">
          <img
            className="size-40 rounded-full"
            src={
              profilePicture ? URL.createObjectURL(profilePicture) : undefined
            }
          />
          <div className="flex flex-col gap-2">
            <Typography variant="h2">
              {userQuery.data?.user.name} {userQuery.data?.user.lastName}
            </Typography>
            <div className="flex gap-2">
              {tags.map((tag) => (
                <Badge key={tag.id}>{tag.name}</Badge>
              ))}
            </div>
            <Typography variant="muted">
              {userQuery.data?.user.biography}
            </Typography>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Button size="icon" className="rounded-full">
              <Heart />
            </Button>
            <Button size="icon" className="rounded-full">
              <MessageCircle />
            </Button>
          </div>
        </div>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-6">
        <Typography variant="large">Pictures</Typography>
        <div className="flex flex-col items-center gap-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {pictures.map((picture) => (
              <ImageContainer
                key={picture.name}
                imageSrc={URL.createObjectURL(picture)}
                altImage="Profile picture"
              />
            ))}
          </div>
        </div>
      </LayoutContent>
    </Layout>
  );
};
