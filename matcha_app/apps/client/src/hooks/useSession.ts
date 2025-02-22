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
        const response = await fetch(
          getUrl('api-auth', {
            type: 'session',
          }),
          {
            credentials: 'include',
          }
        );

        if (!response.ok) throw new Error('Non authentifié');

        const { user } = await response.json();
        setUser(user);
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  return { user: userState, loading };
};
