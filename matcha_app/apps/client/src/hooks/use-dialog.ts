import { create } from 'zustand';

type TDialogDataMap = {
  'create-tag': undefined;
  'upload-picture': undefined;
};

export type TDialogType = keyof TDialogDataMap;

type TGlobalDialogStore = {
  openDialog: TDialogType | null;
  data: TDialogDataMap[TDialogType] | undefined;
  setOpenDialog: <T extends TDialogType>(
    dialogType: T | null,
    data?: TDialogDataMap[T]
  ) => void;
};

export const useGlobalDialogStore = create<TGlobalDialogStore>((set) => ({
  openDialog: null,
  data: undefined,
  setOpenDialog: (dialogType, data) => set({ openDialog: dialogType, data }),
}));

export const getDataForDialog = <T extends TDialogType>(
  dialogType: T
): TDialogDataMap[T] | undefined => {
  const { openDialog, data } = useGlobalDialogStore.getState();

  if (openDialog === dialogType) {
    return data as TDialogDataMap[T];
  }

  return undefined;
};

export function openGlobalDialog<T extends TDialogType>(
  type: T,
  args?: TDialogDataMap[T] extends undefined ? never : TDialogDataMap[T]
): void {
  useGlobalDialogStore.getState().setOpenDialog(type, args);
}

export const closeGlobalDialog = () => {
  useGlobalDialogStore.getState().setOpenDialog(null);
};

export const assertDialogData = <T extends TDialogType>(
  _dialogType: T,
  data: TDialogDataMap[T] | undefined
): data is TDialogDataMap[T] => {
  return data !== undefined;
};
