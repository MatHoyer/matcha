import LoginForm from '@/components/forms/Login.form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { getUrl } from '@matcha/common';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="size-full flex justify-center items-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>
            <Typography variant="h2">Login</Typography>
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
    </div>
  );
};

export default LoginPage;
