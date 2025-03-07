import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { LoadingButton } from '@/components/ui/loaders';
import { PropsWithChildren } from 'react';

export const SubmitButtonDialog: React.FC<
  {
    isLoading: boolean;
  } & PropsWithChildren
> = ({ isLoading, children }) => {
  return (
    <DialogFooter className="flex flex-col gap-2 md:flex-row">
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <LoadingButton type="submit" loading={isLoading}>
        {children}
      </LoadingButton>
    </DialogFooter>
  );
};
