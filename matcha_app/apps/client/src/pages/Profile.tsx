import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from '@/components/pagination/Layout';

export const Profile = () => {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>My profile</LayoutTitle>
      </LayoutHeader>
      <LayoutContent>
        <h1>Profile</h1>
      </LayoutContent>
    </Layout>
  );
};
