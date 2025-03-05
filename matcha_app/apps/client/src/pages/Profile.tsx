import { ProfileForm } from '@/components/forms/Profile.form';
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
        <ProfileForm />
      </LayoutContent>
    </Layout>
  );
};
