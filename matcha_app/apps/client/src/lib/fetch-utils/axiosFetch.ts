import { Infer, ZodType } from '@matcha/common';
import axios, { AxiosRequestConfig } from 'axios';
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
    cb?: (data: Infer<T>) => void;
  };
}): Promise<Infer<T>> => {
  try {
    const response = await axios({
      method,
      url,
      data,
      ...config,
    });

    return (await defaultMutationEnding({
      res: response,
      ...handleEnding,
      responseSchema: schemas.response,
    })) as Infer<T>;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Server Error:', error.response.data);
    }
    throw error;
  }
};
