import { getUrl } from '@matcha/common';
import { ChevronsUpDown, Home, MessageCircleHeart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import { Pages } from './pages/Pages';

const App = () => {
  const session = useSession();
  const navigate = useNavigate();

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
                  { title: 'Chat', icon: MessageCircleHeart, url: '/chat' },
                ]}
              />
              <NavItemDropdown
                item={{
                  title: 'Dropdown',
                  icon: Home,
                  items: [
                    { title: 'Item 1', url: '/item-1' },
                    { title: 'Item 2', url: '/item-2' },
                  ],
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
    </NavigationWrapper>
  );
};

export default App;
