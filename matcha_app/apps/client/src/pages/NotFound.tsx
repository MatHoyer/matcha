import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';

export const NotFound = () => {
  return (
    <div className="size-full flex justify-center items-center">
      <div className="flex h-10 items-end gap-2">
        <Typography variant="h1">404</Typography>
        <Separator orientation="vertical" />
        <Typography variant="h2">Page not found</Typography>
      </div>
    </div>
  );
};
