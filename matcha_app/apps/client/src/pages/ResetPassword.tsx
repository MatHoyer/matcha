import ResetPasswordForm from '@/components/forms/ResetPasword.form';
import { Layout, LayoutContent } from '@/components/pagination/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

const ResetPasswordPage: React.FC = () => {
  return (
    <Layout>
      <LayoutContent className="flex justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>
              <Typography variant="h2">Reset Password</Typography>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ResetPasswordForm />
          </CardContent>
        </Card>
      </LayoutContent>
    </Layout>
  );
};

export default ResetPasswordPage;
