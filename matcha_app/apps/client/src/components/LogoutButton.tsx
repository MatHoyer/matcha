import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { getUrl, logoutSchemas } from '@matcha/common';
import { useMutation } from '@tanstack/react-query';
import { LoadingButton } from './ui/loaders';

export const LogoutButton = () => {
  const removeCookieMutation = useMutation({
    mutationFn: async () => {
      await axiosFetch({
        method: 'GET',
        url: getUrl('api-auth', { type: 'logout' }),
        schemas: logoutSchemas,
        handleEnding: {
          errorMessage: 'Logout failed',
          cb: () => {
            window.location.reload();
          },
        },
      });
    },
  });

  return (
    <LoadingButton
      variant="destructive"
      onClick={() => {
        removeCookieMutation.mutate();
      }}
      loading={removeCookieMutation.isPending}
    >
      Logout
    </LoadingButton>
  );
};
