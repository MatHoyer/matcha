import { useAlertDialogStore } from './alert-dialog-store';
import { AlertDialogRenderedDialog } from './AlertDialogRenderedDialog';

export const AlertDialogRenderer = () => {
  const dialogs = useAlertDialogStore((state) => state.dialogs);

  if (dialogs.length > 0) {
    return dialogs.map((dialog) => (
      <AlertDialogRenderedDialog key={dialog.id} {...dialog} />
    ));
  }

  return null;
};
