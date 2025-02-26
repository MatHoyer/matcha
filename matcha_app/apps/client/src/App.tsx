import { getUrl, TUser, TUserWithNames } from '@matcha/common';
import {
  ChevronsUpDown,
  Crosshair,
  Heart,
  Home,
  MessageCircleHeart,
  Search,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatContainer } from './components/ChatContainer';
import { Logo } from './components/images/Logo';
import { NavItemDropdown, NavItems } from './components/sidebar/NavComp';
import { NavigationWrapper } from './components/sidebar/NavigationWrapper';
import UserDropdown from './components/sidebar/UserDropdown';
import { Avatar, AvatarImage } from './components/ui/avatar';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
} from './components/ui/sidebar';
import { Typography } from './components/ui/typography';
import { useSession } from './hooks/useSession';
import { useUsers } from './hooks/useUsers';
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
    // const createOrGetRoom = (
    //   otherUserId: number
    // ): Promise<{ id: string }> => {
    //   return new Promise((resolve) => {
    //     const user = session.user;
    //     const userId = user?.id as number;
    //     socket.emit(
    //       SOCKETS_EVENTS.CLIENT.CREATE_ROOM,
    //       userId,
    //       otherUserId,
    //       (room: { id: string }) => {
    //         resolve(room);
    //       }
    //     );
    //   });
    // };

    // const chatRoom = await createOrGetRoom(otherUser.id);
    const chatRoomId = `chat-${session.user!.id}-${otherUser.id}`;
    const chatRoom = { id: chatRoomId };

    setOpenChats((prev) => {
      if (!prev.some((chat) => chat.id === chatRoom.id)) {
        return [...prev, { otherUser, id: chatRoom.id, status: 'full' }];
      }
      return prev;
    });
  };

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
                      url: getUrl('client-research', { type: 'forYou' }),
                    },
                    {
                      icon: Crosshair,
                      title: 'Advanced search',
                      url: getUrl('client-research', {
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
          <UserDropdown>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <div className="flex size-full items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://github.com/MatHoyer.png" alt="Pp" />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <Typography variant="large" className="truncate">
                    {session.user?.name}
                  </Typography>
                  <Typography variant="muted" className="truncate text-xs">
                    {session.user?.email}
                  </Typography>
                </div>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </UserDropdown>
        )
      }
    >
      <Pages />
      <ChatContainer openedChats={openedChats} setOpenChats={setOpenChats} />
    </NavigationWrapper>
  );
};

export default App;
