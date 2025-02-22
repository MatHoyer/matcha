import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { defaultMutationEnding } from './defaultMutationEnding';

export const axiosFetch = async ({
  method,
  url,
  data = null,
  config = {},
  handleEnding,
}: {
  method: 'get' | 'post' | 'put' | 'delete';
  url: string;
  data?: unknown;
  config: AxiosRequestConfig;
  handleEnding?: {
    successMessage?: string;
    errorMessage?: string;
    // eslint-disable-next-line
    cb?: (data: any) => void;
  };
}) => {
  try {
    const response = await axios({
      method,
      url,
      data,
      ...config,
    });

    return await defaultMutationEnding({
      res: response,
      ...handleEnding,
    });
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      await defaultMutationEnding({
        res: axiosError.response,
        ...handleEnding,
      });
    }
    return error;
  }
};
