import { closeGlobalDialog } from '@/hooks/use-dialog';
import { axiosFetch } from '@/lib/fetch-utils/axiosFetch';
import { createPictureSchemas, getUrl, z } from '@matcha/common';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { ImageContainer } from '../images/ImageContainer';
import { Button } from '../ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { LoadingButton } from '../ui/loaders';

const imageSchema = z
  .file()
  .maxSize(4 * 1024 * 1024)
  .accept(['image/']);

export const UplaodPictureDialog: React.FC = () => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error('No file selected');

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      return await axiosFetch({
        url: getUrl('api-picture', {
          type: 'new',
        }),
        method: 'POST',
        data: {
          picture: {
            name: file.name,
            type: file.type,
            size: file.size,
            buffer: Array.from(uint8Array),
          },
        },
        schemas: createPictureSchemas,
        handleEnding: {
          successMessage: 'Picture uploaded successfully',
          cb: () => {
            setFile(null);
            setPreviewUrl(null);
            closeGlobalDialog();
            queryClient.invalidateQueries({
              queryKey: ['images-profile'],
            });
          },
        },
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;

    if (!selectedFile) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    try {
      const validatedFile = imageSchema.parse(selectedFile);
      setFile(validatedFile);
      setPreviewUrl(URL.createObjectURL(validatedFile));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Invalid file');
      }
      setFile(null);
      setPreviewUrl(null);
    }
  };

  return (
    <DialogContent className="overflow-auto">
      <DialogHeader>
        <DialogTitle>Upload a picture</DialogTitle>
        <DialogDescription>
          Select an image file (JPEG, PNG or GIF, max 4MB)
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-center gap-2">
        <ImageContainer imageSrc={previewUrl} altImage="Uploaded picture">
          {file ? 'Loading preview...' : 'Select a file to preview'}
        </ImageContainer>
        <Input
          type="file"
          onChange={handleFileChange}
          className="cursor-pointer"
          accept="image/jpeg,image/png,image/gif"
        />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <LoadingButton
          loading={uploadMutation.isPending}
          onClick={() => uploadMutation.mutate()}
          disabled={!file}
        >
          Upload
        </LoadingButton>
      </DialogFooter>
    </DialogContent>
  );
};
