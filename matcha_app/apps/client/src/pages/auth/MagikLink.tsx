import { AppLoader } from '@/components/ui/loaders';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { confirmSchemas, getUrl } from '@matcha/common';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export const MagikLink = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ['magik-link'],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: `${getUrl('api-auth', {
          type: 'confirm',
        })}/${token}`,
        schemas: confirmSchemas,
        handleEnding: {
          successMessage: 'Logged in',
          errorMessage: 'Failed to log in',
          cb: () => {
            navigate(getUrl('client-home'));
          },
        },
      });
    },
    retry: false,
  });

  useEffect(() => {
    if (query.isError) {
      navigate(
        getUrl('client-auth', {
          type: 'login',
        })
      );
      toast.error('Token expired');
    }
  }, [query.isError]);

  return (
    <div className="size-full flex items-center justify-center">
      <AppLoader size="60" />
    </div>
  );
};
