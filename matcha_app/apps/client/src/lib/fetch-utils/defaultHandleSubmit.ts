import axios from 'axios';

//eslint-disable-next-line
export const defaultHandleSubmit = (form: any, mutation: any) => {
  //eslint-disable-next-line
  return form.handleSubmit(async (data: any) => {
    mutation.mutate(data, {
      //eslint-disable-next-line
      onError: (error: any) => {
        if (axios.isAxiosError(error)) {
          form.setError('root', {
            type: 'manual',
            message: error.response?.data.message,
          });
        }
      },
    });
  });
};
