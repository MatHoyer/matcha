import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from '@/components/pagination/Layout';

export const ForYou: React.FC = () => {
  //   const [users, setUsers] = useState<
  //     TAdvancedSearchSchema['response']['users'][number][]
  //   >([]);
  //   const [isLoading, setIsLoading] = useState(false);

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>For you</LayoutTitle>
        <LayoutDescription>Profiles you might like</LayoutDescription>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-4"></LayoutContent>
    </Layout>
  );
};
