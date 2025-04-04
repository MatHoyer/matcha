import {
  getUrl,
  getUsersSchemas,
  isNeedUpdateLocationSchemas,
  TNotificationsOtherUserSchema,
  TUser,
  updateLocationSchemas,
} from '@matcha/common';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Crosshair,
  Heart,
  Home,
  MessageCircleHeart,
  Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatContainer } from './components/chat/ChatContainer';
import { Logo } from './components/images/Logo';
import { NavItemDropdown, NavItems } from './components/sidebar/NavComp';
import { NavigationWrapper } from './components/sidebar/NavigationWrapper';
import { UserDropdownTrigger } from './components/sidebar/UserDropdownTrigger';
import { SidebarGroup, SidebarMenu } from './components/ui/sidebar';
import { useChatStore } from './hooks/use-chat';
import { useSession } from './hooks/useSession';
import { axiosFetch } from './lib/fetch-utils/axiosFetch';
import { socket } from './lib/socket';
import { Pages } from './pages/Pages';

const App = () => {
  const session = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [matchUsers, setMatchUsers] = useState<
    Pick<TUser, 'id' | 'name' | 'lastName'>[]
  >([]);

  useQuery({
    queryKey: ['matchUsers'],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-users', {
          type: 'match',
          id: session!.user!.id,
        }),
        schemas: getUsersSchemas,
        handleEnding: {
          cb: (data) => {
            setMatchUsers(data.users);
          },
        },
      });
    },
  });

  const { openedChats, addChatWindow, removeChatWindow } = useChatStore();

  const handleChatClick = (otherUser: TUser) => {
    addChatWindow(otherUser, session.user!.id);
  };

  const updateLocationMutation = useMutation({
    mutationFn: async ({
      latitude,
      longitude,
    }: {
      latitude: number;
      longitude: number;
    }) => {
      return await axiosFetch({
        url: getUrl('api-location'),
        method: 'PUT',
        schemas: updateLocationSchemas,
        data: {
          latitude,
          longitude,
        },
      });
    },
  });

  const isNeedUpdateLocationQuery = useQuery({
    queryKey: ['isNeedUpdateLocation'],
    queryFn: async () => {
      return await axiosFetch({
        url: getUrl('api-location', { type: 'is-need-update' }),
        method: 'GET',
        schemas: isNeedUpdateLocationSchemas,
      });
    },
  });

  const fetchLocationAPI = async () => {
    const locationData = await (await fetch('http://ipapi.co/json/')).json();
    console.log(
      `API fetched: Latitude: ${locationData.latitude}, Longitude: ${locationData.longitude}`
    );
    updateLocationMutation.mutate({
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    });
  };

  useEffect(() => {
    if (isNeedUpdateLocationQuery.data?.isNeedUpdate) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(
            `Geolocation: Latitude: ${latitude}, Longitude: ${longitude}`
          );
          updateLocationMutation.mutate({
            latitude,
            longitude,
          });
        },
        function (error) {
          if (error.code === error.PERMISSION_DENIED) {
            try {
              fetchLocationAPI();
            } catch (fetchError) {
              console.error(
                'Erreur lors de la récupération de l’IP:',
                fetchError
              );
            }
          } else {
            console.error('Erreur de géolocalisation inconnue:', error);
          }
        }
      );
    }

    const chatListHandler = (
      newNotification: TNotificationsOtherUserSchema
    ) => {
      if (
        newNotification.type === 'Unlike' ||
        newNotification.type === 'Match'
      ) {
        queryClient.invalidateQueries({
          queryKey: ['matchUsers'],
        });
        queryClient.invalidateQueries({
          queryKey: ['userMatched'],
        });
      }
    };
    // console.log(`before socket on notification-${session.user?.id}`);
    socket.on(`notification-${session.user?.id}`, chatListHandler);
    return () => {
      socket.off(`notification-${session.user?.id}`, chatListHandler);
    };
  }, [isNeedUpdateLocationQuery.data]);

  return (
    <NavigationWrapper
      sidebarHeader={
        session.user && (
          <Logo size="sm" onClick={() => navigate(getUrl('client-home'))} />
        )
      }
      sidebarContent={
        session.user && (
          <SidebarGroup>
            <SidebarMenu>
              <NavItems
                items={[
                  { title: 'Home', icon: Home, url: getUrl('client-home') },
                ]}
              />
              <NavItemDropdown
                item={{
                  title: 'Search',
                  icon: Search,
                  items: [
                    {
                      icon: Heart,
                      title: 'For you',
                      url: getUrl('client-search', { type: 'forYou' }),
                    },
                    {
                      icon: Crosshair,
                      title: 'Advanced search',
                      url: getUrl('client-search', {
                        type: 'advancedSearch',
                      }),
                    },
                  ],
                }}
              />
              <NavItemDropdown
                item={{
                  title: 'Chat',
                  icon: MessageCircleHeart,
                  items: matchUsers.map((user) => ({
                    title: `${user.name} ${user.lastName}`,
                    url: '',
                    onClick: () => {
                      handleChatClick(user as TUser);
                    },
                  })),
                }}
              />
            </SidebarMenu>
          </SidebarGroup>
        )
      }
      sidebarFooter={
        session.user && (
          <UserDropdownTrigger user={session.user as Omit<TUser, 'password'>} />
        )
      }
    >
      <Pages />
      <ChatContainer
        openedChats={openedChats}
        removeChatWindow={removeChatWindow}
      />
    </NavigationWrapper>
  );
};

export default App;
