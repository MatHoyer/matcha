import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { getUrl, sessionSchemas, TUser } from '@matcha/common';
import { useEffect, useState } from 'react';

export const useSession = () => {
  const [userState, setUser] = useState<Omit<TUser, 'password'> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        await axiosFetch({
          method: 'GET',
          url: getUrl('api-auth', {
            type: 'session',
          }),
          schemas: sessionSchemas,
          handleEnding: {
            cb: (data) => {
              setUser(data.user);
            },
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  return { user: userState, loading };
};
