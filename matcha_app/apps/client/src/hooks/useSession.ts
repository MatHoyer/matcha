import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { getUrl } from '@matcha/common';
import { useEffect, useState } from 'react';

export type User = {
  age: number;
  biography: string | null;
  email: string;
  exp: number;
  gender: string;
  iat: number;
  id: number;
  lastName: string;
  lastTimeOnline: number | null;
  name: string;
  preference: string;
};

export const useSession = () => {
  const [userState, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        await axiosFetch({
          method: 'get',
          url: getUrl('api-auth', {
            type: 'session',
          }),
          config: {
            withCredentials: true,
          },
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
