import { ImageContainer } from '@/components/images/ImageContainer';
import {
  Layout,
  LayoutContent,
  LayoutHeader,
} from '@/components/pagination/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FameRating } from '@/components/ui/FameRating';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { useChatStore } from '@/hooks/use-chat';
import { useSession } from '@/hooks/useSession';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import {
  createLikeSchemas,
  deleteLikeSchemas,
  getNearDate,
  getPicturesSchemas,
  getUrl,
  getUserFameSchemas,
  getUserSchemas,
  getUserTagsSchemas,
  isLikedSchemas,
  TTag,
  usersMatchSchemas,
} from '@matcha/common';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../../lib/socket';

export const UserProfile = () => {
  const { id } = useParams();
  const session = useSession();
  const queryClient = useQueryClient();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [pictures, setPictures] = useState<File[]>([]);
  const [tags, setTags] = useState<TTag[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const { addChatWindow } = useChatStore();
  const [fame, setFame] = useState(1);
  const [haveMatched, setHaveMatched] = useState(false);

  const userQuery = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!id) return null;
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-users', { id: +id }),
        schemas: getUserSchemas,
        handleEnding: {
          cb: () => {
            console.log(
              `about to emit send view ! senderViewId : ${session.user?.id} receiverViewId : ${id}`
            );
            if (session.user?.id !== +id) {
              socket.emit('send-view', {
                senderViewId: session.user?.id,
                receiverViewId: id,
              });
            }
          },
        },
      });
    },
  });

  useQuery({
    queryKey: ['fame', id],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-users', { id: +id! }),
        schemas: getUserFameSchemas,
        handleEnding: {
          cb: (data) => {
            setFame(data.fame);
          },
        },
      });
    },
  });

  useQuery({
    queryKey: ['fame', id],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-users', { id: +id! }),
        schemas: getUserFameSchemas,
        handleEnding: {
          cb: (data) => {
            setFame(data.fame);
          },
        },
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

  useQuery({
    queryKey: ['liked', id],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-likes', {
          type: 'is-liked',
          id: +id!,
        }),
        schemas: isLikedSchemas,
        handleEnding: {
          cb: (data) => {
            setIsLiked(data.isLiked);
          },
        },
      });
    },
  });

  useQuery({
    queryKey: ['userMatched'],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-users', {
          type: 'matched',
          id: +id!,
        }),
        schemas: usersMatchSchemas,
        handleEnding: {
          cb: (data) => {
            setHaveMatched(data.matched);
          },
        },
      });
    },
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      return await axiosFetch({
        method: isLiked ? 'DELETE' : 'POST',
        url: getUrl('api-likes', {
          type: isLiked ? undefined : 'new',
        }),
        schemas: isLiked ? deleteLikeSchemas : createLikeSchemas,
        data: {
          likedId: +id!,
        },
        handleEnding: {
          successMessage: isLiked ? 'Unliked' : 'Liked',
          errorMessage: isLiked ? 'Error unliking' : 'Error liking',
          cb: () => {
            queryClient.invalidateQueries({
              queryKey: ['liked', id],
            });
            queryClient.invalidateQueries({
              queryKey: ['userMatched'],
            });
            socket.emit('send-like-unlike', {
              senderLikeId: session.user?.id,
              receiverLikeId: id,
            });
            queryClient.invalidateQueries({
              queryKey: ['matchUsers'],
            });
          },
        },
      });
    },
  });

  return (
    <Layout>
      <LayoutHeader>
        <div className="flex flex-col md:flex-row gap-5 w-full">
          <div className="flex flex-row md:flex-col items-center gap-5">
            <div className="relative">
              <img
                className="size-40 rounded-full"
                src={
                  profilePicture
                    ? URL.createObjectURL(profilePicture)
                    : undefined
                }
              />
              {userQuery.data?.user && userQuery.data.user.isOnline ? (
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full" />
              ) : (
                <div className="absolute bottom-2 right-2 w-8 h-8 border-4 border-gray-500 bg-background rounded-full" />
              )}
            </div>
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
          </div>
          <div className="flex-1 hidden md:block" />
          <div className="flex flex-row md:flex-col items-end gap-10">
            {userQuery.data?.user && !userQuery.data.user.isOnline && (
              <Typography variant="muted">
                {`Connected ${getNearDate(userQuery.data.user.lastTimeOnline)}`}
              </Typography>
            )}
            <FameRating note={fame} />
            {session.user?.id !== +(id || 0) && (
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  className="rounded-full"
                  onClick={() => likeMutation.mutate()}
                >
                  <Heart fill={isLiked ? 'red' : 'none'} />
                </Button>
                <Button
                  size="icon"
                  className={`rounded-full ${
                    !haveMatched ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => {
                    addChatWindow(userQuery.data!.user, session.user!.id);
                  }}
                  disabled={!haveMatched}
                >
                  <MessageCircle />
                </Button>
              </div>
            )}
          </div>
        </div>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-6">
        <Separator />
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
