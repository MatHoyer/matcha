import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import { create } from 'zustand';
import {
  isStandardDialog,
  TAlertDialogRenderedDialogProps,
} from './AlertDialogRenderedDialog';

type TAlertDialog = TAlertDialogRenderedDialogProps & {
  id: string;
};

type TAlertDialogStore = {
  dialogs: TAlertDialog[];
  addDialog: (dialog: TAlertDialogRenderedDialogProps) => string;
  removeDialog: (dialogId: string) => void;
};

export const useAlertDialogStore = create<TAlertDialogStore>((set, get) => ({
  dialogs: [],
  addDialog: (dialog) => {
    const id = nanoid(10);
    const { removeDialog } = get();

    const newDialog: TAlertDialog = isStandardDialog(dialog)
      ? {
          ...dialog,
          cancel: {
            label: dialog.cancel?.label ?? 'Cancel',
            onClick: (e) => {
              if (dialog.cancel && 'onClick' in dialog.cancel) {
                dialog.cancel?.onClick(e);
                return;
              }
              removeDialog(id);
            },
          },
          action:
            dialog.action && 'onClick' in dialog.action
              ? {
                  label: dialog.action?.label ?? '',
                  onClick: (e) => {
                    if (dialog.action && 'onClick' in dialog.action === false) {
                      removeDialog(id);
                      return;
                    }

                    const onClickReturn = dialog.action?.onClick(e);

                    if (onClickReturn instanceof Promise) {
                      set((state) => {
                        const dialogIndex = state.dialogs.findIndex(
                          (d) => d.id === id
                        );

                        if (dialogIndex !== -1) {
                          const dialogCopy = { ...state.dialogs[dialogIndex] };
                          dialogCopy.loading = true;
                          state.dialogs[dialogIndex] = dialogCopy;
                        }

                        return { dialogs: [...state.dialogs] };
                      });

                      onClickReturn
                        .then(() => {
                          removeDialog(id);
                        })
                        .catch((e) => {
                          toast.error('An error occured...', {
                            description: e.message,
                          });
                        });
                    } else {
                      removeDialog(id);
                    }
                  },
                }
              : dialog.action,
          loading: false,
          id,
        }
      : {
          ...dialog,
          id: id,
        };

    set((state) => ({ dialogs: [...state.dialogs, newDialog] }));

    return id;
  },
  removeDialog: (dialogId) =>
    set((state) => ({
      dialogs: state.dialogs.filter((d) => d.id !== dialogId),
    })),
}));

export const alertDialog = {
  add: (dialog: TAlertDialogRenderedDialogProps) =>
    useAlertDialogStore.getState().addDialog(dialog),
  remove: (dialogId: string) =>
    useAlertDialogStore.getState().removeDialog(dialogId),
};
