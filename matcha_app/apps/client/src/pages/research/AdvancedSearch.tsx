import { AdvancedSearchForm } from '@/components/forms/AdvancedSearch.form';
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from '@/components/pagination/Layout';
import { TUser } from '@matcha/common';
import { useState } from 'react';

export const AdvancedSearch: React.FC = () => {
  const [users, setUsers] = useState<TUser[]>([]);

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Advanced search</LayoutTitle>
        <LayoutDescription>Search love with criterias</LayoutDescription>
      </LayoutHeader>
      <LayoutContent>
        <AdvancedSearchForm
          getData={(data) => {
            setUsers(data.users);
          }}
        />
        {users.map((user) => (
          <div key={user.id}>{user.name}</div>
        ))}
      </LayoutContent>
    </Layout>
  );
};
