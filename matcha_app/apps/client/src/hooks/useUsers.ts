import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { getUrl, getUsersSchemas, TUser } from '@matcha/common';
import { useEffect, useState } from 'react';

export const useUsers = () => {
  const [users, setUsers] = useState<Pick<TUser, 'id' | 'name' | 'lastName'>[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await axiosFetch({
          method: 'GET',
          url: getUrl('api-users'),
          config: {
            withCredentials: true,
          },
          schemas: getUsersSchemas,
          handleEnding: {
            cb: (data) => {
              setUsers(data.users); // Set users list
            },
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  // useEffect(() => {
  //   console.log('users : ', users);
  // }, [users]);
  return { users, loading };
};
