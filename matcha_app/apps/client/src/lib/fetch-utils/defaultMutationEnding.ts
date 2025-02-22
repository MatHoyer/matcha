import { AxiosResponse } from 'axios';
import { toast } from 'sonner';

export const isActionSuccessful = <T, D>(res?: AxiosResponse<T, D>) => {
  if (res && res.status === 200) {
    return true;
  }

  return false;
};

export const defaultMutationEnding = async <T, D>(data: {
  res?: AxiosResponse<T, D>;
  successMessage?: string;
  errorMessage?: string;
  cb?: (data: T) => void | Promise<void>;
}) => {
  const { cb, res, successMessage, errorMessage } = data;

  console.log('erreur', res);
  if (!isActionSuccessful(res)) {
    toast.error(res?.statusText || errorMessage || 'Une erreur est survenue');
    return;
  }

  if (successMessage) {
    toast.success(successMessage);
  }

  if (cb) {
    await cb(res?.data || ({} as T));
  }

  return res;
};
