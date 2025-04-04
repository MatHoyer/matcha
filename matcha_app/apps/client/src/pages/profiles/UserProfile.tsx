import { ImageContainer } from '@/components/images/ImageContainer';
import { UserAvatar } from '@/components/images/UserAvatar';
import {
  Layout,
  LayoutContent,
  LayoutHeader,
} from '@/components/pagination/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FameRating } from '@/components/ui/FameRating';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { useChatStore } from '@/hooks/use-chat';
import { openGlobalDialog } from '@/hooks/use-dialog';
import { useSession } from '@/hooks/useSession';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import {
  blockUserSchemas,
  createLikeSchemas,
  deleteLikeSchemas,
  getNearDate,
  getPicturesSchemas,
  getProfilePictureSchemas,
  getUrl,
  getUserFameSchemas,
  getUserSchemas,
  getUserTagsSchemas,
  isBlockedSchemas,
  isLikedSchemas,
  likesMeSchemas,
  TTag,
  unblockUserSchemas,
  usersMatchSchemas,
} from '@matcha/common';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  EllipsisVertical,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../../lib/socket';

const ElipsisDropdown: React.FC<{ isBlocked: boolean }> = ({ isBlocked }) => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const blockMutation = useMutation({
    mutationFn: async () => {
      return await axiosFetch({
        method: isBlocked ? 'DELETE' : 'POST',
        url: getUrl('api-block'),
        schemas: isBlocked ? unblockUserSchemas : blockUserSchemas,
        data: {
          userId: +id!,
        },
        handleEnding: {
          successMessage: isBlocked ? 'User unblocked' : 'User blocked',
          errorMessage: isBlocked
            ? 'Error unblocking user'
            : 'Error blocking user',
          cb: () => {
            queryClient.invalidateQueries({
              queryKey: [id],
            });
          },
        },
      });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className={'rounded-full'}>
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => blockMutation.mutate()}>
          {isBlocked ? 'Unblock' : 'Block'}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            openGlobalDialog('report-user', {
              userId: +id!,
            })
          }
        >
          Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const UserProfile = () => {
  const { id } = useParams();
  const session = useSession();
  const queryClient = useQueryClient();
  const [pictures, setPictures] = useState<File[]>([]);
  const [tags, setTags] = useState<TTag[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likesMe, setLikesMe] = useState(false);
  const { addChatWindow } = useChatStore();
  const [fame, setFame] = useState(1);
  const [haveMatched, setHaveMatched] = useState(false);
  const [canLike, setCanLike] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedMe, setBlockedMe] = useState(false);

  useQuery({
    queryKey: ['isBlocked', id],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-users', { id: +id!, type: 'isBlocked' }),
        schemas: isBlockedSchemas,
        handleEnding: {
          cb: (data) => {
            setIsBlocked(data.blocked);
          },
        },
      });
    },
  });

  useQuery({
    queryKey: ['blockedMe', id],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-users', { id: +id!, type: 'blockedMe' }),
        schemas: isBlockedSchemas,
        handleEnding: {
          cb: (data) => {
            setBlockedMe(data.blocked);
          },
        },
      });
    },
  });

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
        url: getUrl('api-users', { id: +id!, type: 'fame' }),
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
    queryKey: ['likes-me', id],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-likes', {
          type: 'likes-me',
          id: +id!,
        }),
        schemas: likesMeSchemas,
        handleEnding: {
          cb: (data) => {
            setLikesMe(data.isLiked);
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

  useQuery({
    queryKey: ['image-profile', 'profile'],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-picture', {
          type: 'user-pp',
          id: session.user?.id,
        }),
        schemas: getProfilePictureSchemas,
        handleEnding: {
          cb: (data) => {
            setCanLike(!!data.picture);
          },
        },
      });
    },
  });

  return (
    <Layout>
      <LayoutHeader>
        <div className="flex flex-col md:flex-row gap-5 w-full">
          <div className="flex items-center  gap-5">
            <div className="relative">
              {userQuery.data?.user && (
                <UserAvatar user={userQuery.data.user} size="md" />
              )}
              {userQuery.data?.user && userQuery.data.user.isOnline ? (
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full" />
              ) : (
                <div className="absolute bottom-2 right-2 w-5 h-5 border-4 border-gray-500 bg-background rounded-full" />
              )}
            </div>
            <div>
              <Typography variant="h2">
                {userQuery.data?.user.name} {userQuery.data?.user.lastName}
              </Typography>
              {userQuery.data?.user && !userQuery.data.user.isOnline && (
                <Typography variant="muted">
                  {`Connected ${getNearDate(
                    userQuery.data.user.lastTimeOnline
                  )}`}
                </Typography>
              )}
            </div>
          </div>
          <div className="flex-1 hidden md:block" />
          <div className="flex flex-col items-end gap-5 mt-auto">
            <FameRating note={fame} />
            {session.user?.id !== +(id || 0) && (
              <div className="flex items-center gap-2">
                {likesMe && !isLiked && (
                  <div className="flex items-center space-x-2">
                    <span className=" text-sm">Like back for a match !</span>
                    <motion.div
                      animate={{ x: [0, 5, -5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.5,
                        ease: 'easeInOut',
                      }}
                    >
                      <ChevronRight />
                    </motion.div>
                  </div>
                )}
                <Button
                  size="icon"
                  className="rounded-full"
                  onClick={canLike ? () => likeMutation.mutate() : undefined}
                  disabled={!canLike || isBlocked || blockedMe}
                >
                  <Heart fill={isLiked ? 'red' : 'none'} />
                </Button>
                <Button
                  size="icon"
                  className={'rounded-full'}
                  disabled={!haveMatched || isBlocked || blockedMe}
                  onClick={() => {
                    addChatWindow(userQuery.data!.user, session.user!.id);
                  }}
                >
                  <MessageCircle />
                </Button>
                <ElipsisDropdown isBlocked={isBlocked} />
              </div>
            )}
          </div>
        </div>
      </LayoutHeader>
      <Separator />
      <LayoutContent className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-1/2 flex flex-col gap-6">
          <Typography variant="large">Bio</Typography>
          <Typography variant="muted">
            {userQuery.data?.user.biography}
          </Typography>
          <div className="flex gap-2">
            {tags.map((tag) => (
              <Badge key={tag.id} className="text-md px-3 py-1">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
        {/* <Separator /> */}
        <div className="lg:w-1/2 flex flex-col gap-6">
          <Typography variant="large">Pictures</Typography>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-3  lg:grid-cols-2 xl:grid-cols-2 gap-3">
              {pictures.map((picture) => (
                <ImageContainer
                  key={picture.name}
                  imageSrc={URL.createObjectURL(picture)}
                  altImage="Profile picture"
                />
              ))}
            </div>
          </div>
        </div>
      </LayoutContent>
    </Layout>
  );
};
