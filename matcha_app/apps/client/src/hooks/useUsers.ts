import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { getUrl } from '@matcha/common';
import { useEffect, useState } from 'react';

export type User = {
    id: number;
    name: string;
    email: string;
    age: number;
    gender: string;
  };
  
  export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          await axiosFetch({
            method: "get",
            url: getUrl("api-users", {
              type: "getUsers",
            }),
            config: {
              withCredentials: true,
            },
            handleEnding: {
              cb: (data) => {
                setUsers(data); // Set users list
              },
            },
          });
        } finally {
          setLoading(false);
        }
      };
  
      fetchUsers();
    }, []);
  
    return { users, loading };
  };