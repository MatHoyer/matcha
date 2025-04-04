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
  form,
  handleEnding,
}: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  data?: Infer<R> | FormData;
  config?: AxiosRequestConfig;
  schemas: {
    requirements?: R;
    response: T;
  };
  // eslint-disable-next-line
  form?: any;
  handleEnding?: {
    successMessage?: string;
    errorMessage?: string;
    cb?: (data: Infer<T>) => void;
  };
}): Promise<Infer<T>> => {
  try {
    if (data instanceof FormData) {
      config = {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: [],
      };
    }

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
      if (form && form.setError) {
        for (const field of error.response.data.fields) {
          form.setError(field.field, {
            type: 'manual',
            message: field.message,
          });
        }
      }
    }
    throw error;
  }
};
