import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { defaultMutationEnding } from './defaultMutationEnding';

export const axiosFetch = async ({
  method,
  url,
  data = null,
  config = {},
  handleEnding = {
    successMessage: 'Request successful',
    errorMessage: 'Failed to make request',
    cb: () => {
      console.log('Request successful');
    },
  },
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

    return defaultMutationEnding({
      res: response,
      ...handleEnding,
    });
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return defaultMutationEnding({
        res: axiosError.response,
        ...handleEnding,
      });
    }
  }
};
