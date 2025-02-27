import { SubmitButtonDialog } from '@/components/dialogs/components/SubmitButton.dialog';
import { LoadingButton } from '@/components/ui/loaders';
import { PropsWithChildren } from 'react';

export const SubmitButtonForm: React.FC<
  {
    modal?: boolean;
    isLoading?: boolean;
  } & PropsWithChildren
> = ({ modal = false, isLoading = false, children = 'Submit' }) => {
  return modal ? (
    <SubmitButtonDialog isLoading={isLoading}>{children}</SubmitButtonDialog>
  ) : (
    <LoadingButton type="submit" loading={isLoading}>
      {children}
    </LoadingButton>
  );
};
