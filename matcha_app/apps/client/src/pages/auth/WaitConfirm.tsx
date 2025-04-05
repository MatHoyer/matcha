import { Layout, LayoutContent } from '@/components/pagination/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { cn } from '@/lib/utils';
import { getUrl, resendConfirmSchemas } from '@matcha/common';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export const WaitConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, _setSearchParams] = useSearchParams();
  const [isDisabled, setIsDisabled] = useState(true);
  const [isSended, setIsSended] = useState(false);
  const duration = 10;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsDisabled(false);
    }, duration * 1000);

    return () => clearTimeout(timeout);
  }, []);

  if (!searchParams.get('token')) {
    navigate(getUrl('client-auth', { type: 'login' }));
    toast.error('Wrong token');
  }

  const resendMutation = useMutation({
    mutationFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: `${getUrl('api-auth', {
          type: 'resend-confirm',
        })}/${searchParams.get('token')}`,
        schemas: resendConfirmSchemas,
        handleEnding: {
          successMessage: 'Confirmation email sent',
          errorMessage: 'Failed to send confirmation email',
        },
      });
    },
  });

  return (
    <Layout>
      <LayoutContent className="flex justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Waiting for your account activation</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Separator />
            <Typography variant="small">
              We sent you an email to activate your account, if you don't see
              the email, please don't forget to check your spam folder
            </Typography>
            <Button
              variant="outline"
              onClick={() => {}}
              disabled={isDisabled}
              className="relative w-full overflow-hidden"
            >
              {isDisabled && (
                <motion.div
                  className={cn(
                    'absolute inset-0 bg-foreground/60 w-full',
                    isSended && 'hidden'
                  )}
                  initial={{ left: '-100%' }}
                  animate={{ left: '0%' }}
                  transition={{
                    duration: duration,
                    ease: 'linear',
                  }}
                />
              )}
              <Typography
                className="relative z-10"
                onClick={() => {
                  resendMutation.mutate();
                  setIsDisabled(true);
                  setIsSended(true);
                }}
              >
                Resend confirmation email
              </Typography>
            </Button>
            {!resendMutation.isPending && resendMutation.isError && (
              <>
                <Typography variant="small">
                  Token expired, please try again
                </Typography>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate(getUrl('client-auth', { type: 'login' }));
                  }}
                >
                  Return to login
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </LayoutContent>
    </Layout>
  );
};
