import { ProfileForm } from '@/components/forms/Profile.form';
import { ImageContainer } from '@/components/images/ImageContainer';
import {
  Layout,
  LayoutContent,
  LayoutHeader,
} from '@/components/pagination/Layout';
import { Button } from '@/components/ui/button';
import { AppLoader } from '@/components/ui/loaders';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { openGlobalDialog } from '@/hooks/use-dialog';
import { useSession } from '@/hooks/useSession';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import {
  askResetPasswordSchemas,
  deletePictureSchemas,
  getPicturesSchemas,
  getUrl,
  updatePictureSchemas,
} from '@matcha/common';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
              size="icon"
              className={'rounded-full border boder-black bg-primary'}
              onClick={() => updateMutation.mutate()}
              disabled={isProfile}
            >
              <Heart fill={isProfile ? 'red' : 'none'} />
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

export const PersonnalProfile = () => {
  const session = useSession();
  const navigate = useNavigate();
  const imageQuery = useQuery({
    queryKey: ['images-profile', 'profile'],
    queryFn: async () => {
      return await axiosFetch({
        method: 'GET',
        schemas: getPicturesSchemas,
        url: getUrl('api-picture', {
          type: 'user',
          id: session!.user!.id,
        }),
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async () => {
      return await axiosFetch({
        method: 'GET',
        url: getUrl('api-users', {
          type: 'reset-password',
        }),
        schemas: askResetPasswordSchemas,
        handleEnding: {
          successMessage: 'Reset password email sent',
          errorMessage: 'Failed to send reset password email',
        },
      });
    },
  });

  return (
    <Layout>
      <LayoutHeader>
        <div className="flex flex-row items-center justify-between w-full">
          <div className="layout-title">My profile</div>

          <div className="flex">
            <Button
              variant="ghost"
              className="w-full md:w-auto mt-2"
              onClick={() =>
                navigate(getUrl('client-profile', { id: session!.user!.id }))
              }
            >
              View my profile
            </Button>
          </div>
        </div>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-1/2 flex flex-col gap-6">
          <Typography variant="large">Informations</Typography>
          <ProfileForm />
          <Separator />
          <Button
            variant="destructive"
            onClick={() => resetPasswordMutation.mutate()}
          >
            Reset password
          </Button>
        </div>

        <div className="lg:w-1/2 flex flex-col gap-6">
          <Typography variant="large">Pictures</Typography>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-3  lg:grid-cols-2 xl:grid-cols-2 gap-3">
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
                length: 6 - (imageQuery.data?.pictures.length ?? 0),
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
        </div>
      </LayoutContent>
    </Layout>
  );
};
