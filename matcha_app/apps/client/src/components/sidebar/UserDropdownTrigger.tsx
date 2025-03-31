import { socket } from '@/lib/socket';
import { useNotification } from '@/pages/notification/Notifications-context';
import { TUser } from '@matcha/common';
import { ChevronsUpDown } from 'lucide-react';
import { useEffect } from 'react';
import { UserAvatar } from '../images/UserAvatar';
import { SidebarMenuButton } from '../ui/sidebar';
import { Typography } from '../ui/typography';
import UserDropdown from './UserDropdown';

export const UserDropdownTrigger: React.FC<{
  user: Omit<TUser, 'password'>;
}> = ({ user }) => {
  const { showBubble, setShowBubble } = useNotification();

  useEffect(() => {
    const notificationBubbleHandler = () => {
      setShowBubble(true);
      localStorage.setItem('showBubble', JSON.stringify(true));
    };
    socket.on(`notification-bubble`, notificationBubbleHandler);
    return () => {
      socket.off(`notification-bubble`, notificationBubbleHandler);
    };
  }, []);

  return (
    <UserDropdown>
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
      >
        <div className="flex size-full items-center gap-2">
          <div className="relative">
            <UserAvatar user={user} size="sm" />
            {showBubble && (
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border"></div>
            )}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <Typography variant="large" className="truncate">
              {user?.name}
            </Typography>
            <Typography variant="muted" className="truncate text-xs">
              {user?.email}
            </Typography>
          </div>
        </div>
        <ChevronsUpDown className="ml-auto size-4" />
      </SidebarMenuButton>
    </UserDropdown>
  );
};
