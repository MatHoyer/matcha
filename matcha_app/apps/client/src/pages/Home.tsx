import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from '@/components/pagination/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { useSession } from '@/hooks/useSession';
import { getDateAsString } from '@matcha/common';

export const Home = () => {
  const { user } = useSession();

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>MATCHA</LayoutTitle>
        <LayoutDescription>Home page</LayoutDescription>
      </LayoutHeader>
      <LayoutContent className="flex flex-col items-center">
        <Card>
          <CardHeader>
            <CardTitle>Connect as:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {user &&
                Object.entries(user).map(([key, value]) => (
                  <Typography key={key} variant="muted">
                    {key}:{' '}
                    {value instanceof Date
                      ? getDateAsString({
                          date: value as Date,
                          type: 'FULL',
                        })
                      : (value as string | number | null | undefined)}
                  </Typography>
                ))}
            </div>
          </CardContent>
        </Card>
      </LayoutContent>
    </Layout>
  );
};
