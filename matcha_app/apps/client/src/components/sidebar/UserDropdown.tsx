'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUrl } from '@matcha/common';
import { Bell, User } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoutButton } from '../ui/LogoutButton';
import { useNotification } from '../../pages/notification/Notification-context';

const UserDropdown: React.FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const { showBubble, setShowBubble } = useNotification();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              navigate(getUrl('client-notifications'));
              setShowBubble(false);
              localStorage.setItem('showBubble', JSON.stringify(false));
            }}
          >
            <Bell />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigate(getUrl('client-profile'))}
          >
            <User />
            My profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
