import {
  getUrl,
  TUser,
  TUserWithNames,
  updateLocationSchemas,
} from '@matcha/common';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Crosshair,
  Heart,
  Home,
  MessageCircleHeart,
  Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isNeedUpdateLocationSchemas } from '../../common/src/schemas/api/location.schema';
import { ChatContainer } from './components/chat/ChatContainer';
import { Logo } from './components/images/Logo';
import { NavItemDropdown, NavItems } from './components/sidebar/NavComp';
import { NavigationWrapper } from './components/sidebar/NavigationWrapper';
import { UserDropdownTrigger } from './components/sidebar/UserDropdownTrigger';
import { SidebarGroup, SidebarMenu } from './components/ui/sidebar';
import { useSession } from './hooks/useSession';
import { useUsers } from './hooks/useUsers';
import { axiosFetch } from './lib/fetch-utils/axiosFetch';
import { Pages } from './pages/Pages';
import { useChatStore } from './hooks/use-chat';

const App = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { users } = useUsers();
  const usersAllButAuthUser = users.filter(
    (user: TUserWithNames) => user.id !== session.user?.id
  );

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
                  items: usersAllButAuthUser.map((otherUser) => ({
                    title: `${otherUser.name} ${otherUser.lastName} ${otherUser.id}`,
                    url: '',
                    onClick: () => {
                      handleChatClick(otherUser as TUser);
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
