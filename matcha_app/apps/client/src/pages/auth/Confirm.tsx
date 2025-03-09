import { Layout, LayoutContent } from '@/components/pagination/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const ConfirmPage: React.FC = () => {
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsDisabled(false);
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Layout>
      <LayoutContent className="flex justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Waiting for confirmation</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Separator />
            <Typography variant="small">
              If you don't see the email, please don't forget to check your spam
              folder
            </Typography>
            <Button
              variant="outline"
              onClick={() => {}}
              disabled={isDisabled}
              className="relative w-full overflow-hidden"
            >
              {isDisabled && (
                <motion.div
                  className="absolute inset-0 bg-foreground/60 w-full"
                  initial={{ left: '-100%' }}
                  animate={{ left: '0%' }}
                  transition={{
                    duration: 10,
                    ease: 'linear',
                  }}
                />
              )}
              <Typography className="relative z-10">
                Resend confirmation email
              </Typography>
            </Button>
          </CardContent>
        </Card>
      </LayoutContent>
    </Layout>
  );
};

export default ConfirmPage;
