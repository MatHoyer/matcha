import { getUrl } from '@matcha/common';
import { useMutation } from '@tanstack/react-query';
import { LoadingButton } from './ui/loaders';

export const LogoutButton = () => {
  const removeCookieMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        getUrl('api-auth', {
          type: 'logout',
        }),
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      if (!res.ok) throw new Error('Error while logout');
      window.location.reload();
      return await res.json();
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
