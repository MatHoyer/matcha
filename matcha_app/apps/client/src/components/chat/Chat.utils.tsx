import { useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { getUrl, lastOnlineSchema } from '@matcha/common';

const useUpdateLastOnline = () => {
  const session = useSession();

  useEffect(() => {
    const updateLastOnline = async () => {
      try {
        await axiosFetch({
          method: 'POST',
          url: getUrl('api-lastOnline'),
          schemas: lastOnlineSchema,
          data: { userId: session.user!.id },
          handleEnding: {
            cb: (data) => {
              console.log('Last online updated:', data);
            },
          },
        });
      } catch (error) {
        console.error('Error updating last online:', error);
      }
    };

    updateLastOnline();
    const interval = setInterval(updateLastOnline, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
};

export default useUpdateLastOnline;
