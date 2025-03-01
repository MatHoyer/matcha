export type TFormProps<T, R> = {
  defaultValues?: Partial<T>;
  modal?: boolean;
  getData?: (data: R) => void;
};
