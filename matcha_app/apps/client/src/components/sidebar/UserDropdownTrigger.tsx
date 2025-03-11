import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { socket } from '@/lib/socket';
import { useNotification } from '@/pages/notification/Notification-context';
import { getProfilePictureSchemas, getUrl, TUser } from '@matcha/common';
import { useQuery } from '@tanstack/react-query';
import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarImage } from '../ui/avatar';
import { SidebarMenuButton } from '../ui/sidebar';
import { Typography } from '../ui/typography';
import UserDropdown from './UserDropdown';

export const UserDropdownTrigger: React.FC<{
  user: Omit<TUser, 'password'>;
}> = ({ user }) => {
  const [file, setFile] = useState<File | null>(null);
  const { showBubble, setShowBubble } = useNotification();

  useQuery({
    queryKey: ['images-profile', 'dropdown'],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        schemas: getProfilePictureSchemas,
        url: getUrl('api-picture', {
          type: 'user-pp',
          id: user.id,
        }),
        handleEnding: {
          cb: (data) => {
            const uint8Array = new Uint8Array(data.picture.file.buffer);
            const file = new File([uint8Array], data.picture.file.name, {
              type: data.picture.file.type,
            });
            setFile(file);
          },
        },
      });
    },
  });

  useEffect(() => {
    const notificationBubbleHandler = () => {
      setShowBubble(true);
      localStorage.setItem('showBubble', JSON.stringify(true));
    };
    socket.on(`notification-bubble`, notificationBubbleHandler);
    // console.log('notif bubble received');
    return () => {
      // console.log('bye');
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
            <Avatar>
              <AvatarImage
                src={file ? URL.createObjectURL(file) : undefined}
                alt="Pp"
              />
            </Avatar>
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
