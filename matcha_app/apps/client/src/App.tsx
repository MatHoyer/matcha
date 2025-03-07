import { getUrl, TUser, TUserWithNames } from '@matcha/common';
import {
  Crosshair,
  Heart,
  Home,
  MessageCircleHeart,
  Search,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatContainer } from './components/chat/ChatContainer';
import { Logo } from './components/images/Logo';
import { NavItemDropdown, NavItems } from './components/sidebar/NavComp';
import { NavigationWrapper } from './components/sidebar/NavigationWrapper';
import { UserDropdownTrigger } from './components/sidebar/UserDropdownTrigger';
import { SidebarGroup, SidebarMenu } from './components/ui/sidebar';
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
