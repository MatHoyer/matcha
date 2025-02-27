import { SubmitButtonDialog } from '@/components/dialogs/components/SubmitButton.dialog';
import { LoadingButton } from '@/components/ui/loaders';

export const SubmitButtonForm: React.FC<{
  modal?: boolean;
  isLoading?: boolean;
  message?: string;
}> = ({ modal = false, isLoading = false, message = 'Submit' }) => {
  return modal ? (
    <SubmitButtonDialog isLoading={isLoading}>{message}</SubmitButtonDialog>
  ) : (
    <LoadingButton type="submit" loading={isLoading}>
      {message}
    </LoadingButton>
  );
};
