import SignupForm from '@/components/forms/Signup.form';
import { Layout, LayoutContent } from '@/components/pagination/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { getUrl } from '@matcha/common';
import { useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <LayoutContent className="flex justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>
              <Typography variant="h2">Sign up</Typography>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <SignupForm />
            <div className="flex items-center gap-2 w-full justify-center">
              <Typography className="text-xs">Already register ?</Typography>
              <Typography
                variant="link"
                className="cursor-pointer text-xs"
                onClick={() =>
                  navigate(
                    getUrl('client-auth', {
                      type: 'login',
                    })
                  )
                }
              >
                Log in
              </Typography>
            </div>
          </CardContent>
        </Card>
      </LayoutContent>
    </Layout>
  );
};

export default SignupPage;
