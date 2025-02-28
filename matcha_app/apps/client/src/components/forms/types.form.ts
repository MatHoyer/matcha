export type TFormProps<T> = {
  defaultValues?: Partial<T>;
  modal?: boolean;
  getData?: (data: T) => void;
};
