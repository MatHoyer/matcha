import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { cn } from '@/lib/utils';
import { getProfilePictureSchemas, getUrl, TUser } from '@matcha/common';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export const UserAvatar: React.FC<{
  user: Omit<TUser, 'password'>;
  size?: 'sm' | 'lg';
}> = ({ user, size = 'sm' }) => {
  const [file, setFile] = useState<File | null>(null);

  const { data } = useQuery({
    queryKey: ['images-profile', user.id],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        schemas: getProfilePictureSchemas,
        url: getUrl('api-picture', {
          type: 'user-pp',
          id: user.id,
        }),
      });
    },
  });

  useEffect(() => {
    if (data) {
      const uint8Array = new Uint8Array(data.picture.file.buffer);
      const file = new File([uint8Array], data.picture.file.name, {
        type: data.picture.file.type,
      });
      setFile(file);
    }
  }, [data]);

  return (
    <Avatar className={cn(size === 'lg' && 'size-44')}>
      <AvatarImage src={file ? URL.createObjectURL(file) : ''} />
      <AvatarFallback className={cn(size === 'lg' && 'text-6xl')}>
        {user.name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};
