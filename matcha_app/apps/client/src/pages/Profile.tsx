import { ProfileForm } from '@/components/forms/Profile.form';
import { ImageContainer } from '@/components/images/ImageContainer';
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from '@/components/pagination/Layout';
import { Button } from '@/components/ui/button';
import { AppLoader } from '@/components/ui/loaders';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { openGlobalDialog } from '@/hooks/use-dialog';
import { useSession } from '@/hooks/useSession';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import {
  deletePictureSchemas,
  getPicturesSchemas,
  getUrl,
  updatePictureSchemas,
} from '@matcha/common';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Star, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

const PictureCard: React.FC<{
  id: number;
  isProfile: boolean;
  file: File | null;
  isLoading?: boolean;
}> = ({ id, isProfile, file, isLoading }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await axiosFetch({
        method: 'DELETE',
        url: getUrl('api-picture', {
          id: id,
        }),
        schemas: deletePictureSchemas,
        handleEnding: {
          successMessage: 'Picture deleted successfully',
          errorMessage: 'Failed to delete picture',
          cb: () => {
            queryClient.invalidateQueries({
              queryKey: ['images-profile'],
            });
          },
        },
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      return await axiosFetch({
        method: 'PATCH',
        url: getUrl('api-picture', {
          id: id,
        }),
        schemas: updatePictureSchemas,
        data: {
          isProfile: !isProfile,
        },
        handleEnding: {
          successMessage: 'Picture updated successfully',
          errorMessage: 'Failed to update picture',
          cb: () => {
            queryClient.invalidateQueries({
              queryKey: ['images-profile'],
            });
          },
        },
      });
    },
  });

  return (
    <div className="relative size-fit">
      <ImageContainer
        imageSrc={file ? URL.createObjectURL(file) : null}
        altImage="Profile picture"
      >
        <div
          onClick={() => openGlobalDialog('upload-picture')}
          className="cursor-pointer size-full flex items-center justify-center"
        >
          {isLoading ? <AppLoader size={60} /> : <Plus />}
        </div>
      </ImageContainer>
      {file && (
        <>
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className={`rounded-full ${
                isProfile
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background/80'
              }`}
              onClick={() => updateMutation.mutate()}
              disabled={isProfile}
            >
              <Star />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="rounded-full"
              onClick={() => deleteMutation.mutate()}
            >
              <Trash2 />
            </Button>
          </div>
          {isProfile && (
            <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              Profile picture
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const Profile = () => {
  const session = useSession();
  const imageQuery = useQuery({
    queryKey: ['images-profile'],
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
            {imageQuery.data?.pictures.map((picture) => {
              const uint8Array = new Uint8Array(picture.file.buffer);
              const file = new File([uint8Array], picture.file.name, {
                type: picture.file.type,
              });
              return (
                <PictureCard
                  key={picture.id}
                  id={picture.id}
                  isProfile={picture.isProfile}
                  file={file}
                />
              );
            })}
            {Array.from({
              length: 5 - (imageQuery.data?.pictures.length ?? 0),
            }).map((_, index) => (
              <PictureCard
                key={index}
                id={index}
                isProfile={false}
                file={null}
                isLoading={imageQuery.isLoading}
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
