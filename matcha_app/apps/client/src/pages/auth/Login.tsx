import LoginForm from '@/components/forms/Login.form';
import { Layout, LayoutContent } from '@/components/pagination/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { getUrl } from '@matcha/common';
import { useTheme } from '../../components/theme/ThemeProvider';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  console.log('theme', theme);

  return (
    <Layout className="flex justify-center">
      <img
        className=" items-center justify-center"
        width={210}
        height={210}
        src={
          theme === 'dark'
            ? '/images/logo_gif_Dark.gif'
            : '/images/logo_gif_Light.gif'
        }
      />
      <LayoutContent className="flex justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>
              <Typography variant="h3">Login</Typography>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <LoginForm />
            <div className="flex items-center gap-2 w-full justify-center">
              <Typography className="text-xs">New here ?</Typography>
              <Typography
                variant="link"
                className="cursor-pointer text-xs"
                onClick={() =>
                  navigate(
                    getUrl('client-auth', {
                      type: 'signup',
                    })
                  )
                }
              >
                Create an account
              </Typography>
            </div>
          </CardContent>
        </Card>
      </LayoutContent>
    </Layout>
  );
};

export default LoginPage;
