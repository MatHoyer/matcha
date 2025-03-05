import { ProfileForm } from '@/components/forms/Profile.form';
import { ImageContainer } from '@/components/images/ImageContainer';
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from '@/components/pagination/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { useSession } from '@/hooks/useSession';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { getPicturesSchemas, getUrl } from '@matcha/common';
import { useQuery } from '@tanstack/react-query';
import { Star, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

const PictureCard: React.FC<{
  id: number;
  isProfile: boolean;
  file: File;
}> = ({ id, isProfile, file }) => {
  return (
    <div className="relative size-fit">
      <ImageContainer
        imageSrc="https://picsum.photos/200/300"
        altImage="Profile picture"
      />
      <div className="absolute top-2 right-2 flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          className={`rounded-full ${
            isProfile
              ? 'bg-primary text-primary-foreground'
              : 'bg-background/80'
          }`}
          disabled={isProfile}
        >
          <Star />
        </Button>
        <Button variant="destructive" size="icon" className="rounded-full">
          <Trash2 />
        </Button>
      </div>
      {isProfile && (
        <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
          Profile picture
        </div>
      )}
    </div>
  );
};

export const Profile = () => {
  const session = useSession();
  const imageQuery = useQuery({
    queryKey: [`images-${session!.user!.id}`],
    queryFn: async () => {
      return await axiosFetch({
        method: 'POST',
        schemas: getPicturesSchemas,
        url: getUrl('api-picture'),
        data: {
          userId: session!.user!.id,
        },
      });
    },
  });

  useEffect(() => {
    if (imageQuery.data) {
      console.log(imageQuery.data);
    }
  }, [imageQuery.data]);

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>My profile</LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-6">
        <div className="hidden md:flex flex-col gap-2">
          <Typography variant="large">Pictures</Typography>
          <div className="flex flex-col gap-4">
            {imageQuery.data?.pictures.map((picture) => (
              <PictureCard
                key={picture.id}
                id={picture.id}
                isProfile={picture.isProfile}
                file={picture.file}
              />
            ))}
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <Typography variant="large">Informations</Typography>
          <ProfileForm />
        </div>
      </LayoutContent>
    </Layout>
  );
};
