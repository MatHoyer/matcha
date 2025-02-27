import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { getGlobalLocationsSchemas, getUrl } from '@matcha/common';
import { useQuery } from '@tanstack/react-query';
import { Combobox } from '../ui/combobox';

const GlobalLocationCombobox: React.FC<{
  value: string | null;
  onChange: (value: string | null) => void;
  modal?: boolean;
}> = ({ value, onChange, modal }) => {
  const query = useQuery({
    queryKey: ['globalLocations'],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-globalLocations'),
        schemas: getGlobalLocationsSchemas,
      });
    },
    retry: false,
    refetchOnWindowFocus: true,
  });

  return (
    <Combobox
      name="location"
      list={
        query.data?.globalLocations.map((gl) => ({
          value: gl.name,
          label: gl.name,
        })) || []
      }
      value={value}
      onChange={onChange}
      modal={modal}
    />
  );
};

export default GlobalLocationCombobox;
