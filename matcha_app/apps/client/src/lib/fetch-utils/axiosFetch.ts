import { Infer, TErrorSchema, ZodType } from '@matcha/common';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { defaultMutationEnding } from './defaultMutationEnding';

export const axiosFetch = async <
  T extends ZodType<D>,
  D,
  R extends ZodType<DD>,
  DD
>({
  method,
  url,
  data,
  config = {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  },
  schemas,
  handleEnding,
}: {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: Infer<R>;
  config?: AxiosRequestConfig;
  schemas: {
    requirements?: R;
    response: T;
  };
  handleEnding?: {
    successMessage?: string;
    errorMessage?: string;
    // eslint-disable-next-line
    cb?: (data: any) => void;
  };
}): Promise<{
  ok: boolean;
  data: TErrorSchema | Infer<T>;
}> => {
  try {
    const response = await axios({
      method,
      url,
      data,
      ...config,
    });

    return {
      ok: true,
      data: (await defaultMutationEnding({
        res: response,
        ...handleEnding,
        responseSchema: schemas.response,
      })) as Infer<T>,
    };
  } catch (error) {
    // console.error(error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<TErrorSchema>;
      if (handleEnding?.errorMessage) {
        toast.error(axiosError.response?.data.message || 'An error occurred');
      }
      return {
        ok: false,
        data: axiosError.response?.data as TErrorSchema,
      };
    }
    if (handleEnding?.errorMessage) {
      toast.error(handleEnding?.errorMessage || 'An error occurred');
    }
    return {
      ok: false,
      data: {
        message: handleEnding?.errorMessage || 'An error occurred',
      } as TErrorSchema,
    };
  }
};
