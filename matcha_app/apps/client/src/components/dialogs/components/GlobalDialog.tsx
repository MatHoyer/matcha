import { Dialog } from '@/components/ui/dialog';
import {
  closeGlobalDialog,
  TDialogType,
  useGlobalDialogStore,
} from '@/hooks/use-dialog';
import { CreateTagDialog } from '../CreateTag.dialog';
import { UplaodPictureDialog } from '../UploadPicture.dialog';

const dialogComponents: Record<TDialogType, React.FC> = {
  'create-tag': CreateTagDialog,
  'upload-picture': UplaodPictureDialog,
};

export const GlobalDialog = () => {
  const dialogType = useGlobalDialogStore((state) => state.openDialog);

  const DialogComponent = dialogType ? dialogComponents[dialogType] : null;

  return (
    <Dialog open={!!dialogType} onOpenChange={closeGlobalDialog}>
      {DialogComponent && <DialogComponent />}
    </Dialog>
  );
};
