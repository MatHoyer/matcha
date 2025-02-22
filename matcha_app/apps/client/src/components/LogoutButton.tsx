import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { getUrl } from '@matcha/common';
import { useMutation } from '@tanstack/react-query';
import { LoadingButton } from './ui/loaders';

export const LogoutButton = () => {
  const removeCookieMutation = useMutation({
    mutationFn: async () => {
      await axiosFetch({
        method: 'get',
        url: getUrl('api-auth', { type: 'logout' }),
        config: {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
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
