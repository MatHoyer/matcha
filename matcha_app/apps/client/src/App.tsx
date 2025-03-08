import {
  getUrl,
  TUser,
  TUserWithNames,
  updateLocationSchemas,
} from '@matcha/common';
import { useMutation } from '@tanstack/react-query';
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
import { useSession } from './hooks/useSession';
import { useUsers } from './hooks/useUsers';
import { axiosFetch } from './lib/fetch-utils/axiosFetch';
import { Pages } from './pages/Pages';

const App = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { users } = useUsers();
  const usersAllButAuthUser = users.filter(
    (user: TUserWithNames) => user.id !== session.user?.id
  );
  const [openedChats, setOpenChats] = useState<
    { id: string; otherUser: TUser; status: 'full' | 'collapse' }[]
  >([]);

  const handleChatClick = (otherUser: TUser) => {
    const sortedUserIds = [session.user!.id, otherUser.id].sort();
    const chatRoomName = `chat-${sortedUserIds[0]}-${sortedUserIds[1]}`;

    const windowRoom = { id: chatRoomName };
    setOpenChats((prev) => {
      if (!prev.some((chatWindow) => chatWindow.id === windowRoom.id)) {
        return [...prev, { otherUser, id: windowRoom.id, status: 'full' }];
      }
      return prev;
    });
  };

  const locationMutation = useMutation({
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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          locationMutation.mutate({
            latitude,
            longitude,
          });
        },
        async function (error) {
          if (error.code === error.PERMISSION_DENIED) {
            const locationData = await (
              await fetch('http://ipapi.co/json/')
            ).json();
            console.log(locationData);
            locationMutation.mutate({
              latitude: locationData.latitude,
              longitude: locationData.longitude,
            });
          } else {
            console.error('Erreur de géolocalisation inconnue:', error);
          }
        }
      );
    } else {
      console.log("La géolocalisation n'est pas supportée par ce navigateur.");
    }
  }, []);

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
                    onClick: () => handleChatClick(otherUser as TUser),
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
      <ChatContainer openedChats={openedChats} setOpenChats={setOpenChats} />
    </NavigationWrapper>
  );
};

export default App;
