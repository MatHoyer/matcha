import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { getProfilePictureSchemas, getUrl, TUser } from '@matcha/common';
import { useQuery } from '@tanstack/react-query';
import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarImage } from '../ui/avatar';
import { SidebarMenuButton } from '../ui/sidebar';
import { Typography } from '../ui/typography';
import UserDropdown from './UserDropdown';

export const UserDropdownTrigger: React.FC<{
  user: Omit<TUser, 'password'>;
}> = ({ user }) => {
  const [file, setFile] = useState<File | null>(null);

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

  return (
    <UserDropdown>
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
      >
        <div className="flex size-full items-center gap-2">
          <Avatar>
            <AvatarImage
              src={file ? URL.createObjectURL(file) : undefined}
              alt="Pp"
            />
          </Avatar>
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
