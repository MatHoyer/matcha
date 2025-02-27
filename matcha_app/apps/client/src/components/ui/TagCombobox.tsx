import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { getTagsSchemas, getUrl } from '@matcha/common';
import { useQuery } from '@tanstack/react-query';
import { MultiCombobox } from './combobox';

const MultiTagCombobox: React.FC<{
  value: string[] | null;
  onChange: (value: string[] | null) => void;
}> = ({ value, onChange }) => {
  const query = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-tags'),
        schemas: getTagsSchemas,
      });
    },
    retry: false,
    refetchOnWindowFocus: true,
  });

  return (
    <MultiCombobox
      name="tag"
      list={
        query.data?.tags.map((tag) => ({
          value: tag.name,
          label: tag.name,
        })) || []
      }
      value={value}
      onChange={onChange}
    />
  );
};

export default MultiTagCombobox;
