import { Infer, ZodType } from '@matcha/common';
import { AxiosResponse } from 'axios';
import { toast } from 'sonner';

export const defaultMutationEnding = async <T extends ZodType<D>, D>(data: {
  // eslint-disable-next-line
  res?: AxiosResponse<any, any>;
  successMessage?: string;
  cb?: (data: Infer<T>) => void | Promise<void>;
  responseSchema: T;
}) => {
  const { cb, res, successMessage, responseSchema } = data;

  const responseData = responseSchema.safeParse(res?.data);
  console.log(res?.data);
  if (!responseData.success) {
    console.error('Axios fetch response type invalid:', responseData.error);
    return null;
  }

  if (successMessage) {
    toast.success(successMessage);
  }

  if (cb) {
    await cb(responseData.data as Infer<T>);
  }

  return responseData.data as Infer<T>;
};
