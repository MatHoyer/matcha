import {
  Layout,
  LayoutContent,
  LayoutHeader,
} from '@/components/pagination/Layout';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { useSession } from '@/hooks/useSession';
import { useTheme } from '../components/theme/ThemeProvider';

export const Home = () => {
  const { user } = useSession();
  // const { theme } = useTheme();
  // const { theme = 'dark' } = useTheme() || {};
  const { theme: rawTheme } = useTheme() || {};
  const theme = rawTheme === 'system' ? 'dark' : rawTheme || 'dark';

  return (
    <Layout className="flex flex-row items-center">
      <LayoutHeader className="flex items-center justify-center">
        <img
          width={150}
          height={150}
          src={
            theme === 'dark'
              ? '/images/logo_bigGif_Dark.gif'
              : '/images/logo_bigGif_Light.gif'
          }
        />
      </LayoutHeader>
      <LayoutContent className="flex flex-col items-center">
        <Card>
          <CardHeader>
            <CardTitle>Hi {user?.name}, how are u today ?</CardTitle>
            <div className="mb-1" />
            <Typography variant="muted">
              Browse through profiles tailored just for you and find someone
              special :)
            </Typography>
          </CardHeader>
        </Card>
      </LayoutContent>
    </Layout>
  );
};
