import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

export const ImageContainer: React.FC<
  {
    imageSrc: string;
    altImage: string;
    size?: 'sm' | 'lg';
  } & ComponentProps<'div'>
> = ({ imageSrc, altImage, size = 'lg', className, ...containerProps }) => {
  return (
    <div
      className={cn(
        className,
        size === 'sm' ? 'w-[90px]' : 'w-[300px]',
        'relative aspect-[3/4] overflow-hidden rounded-lg border bg-muted'
      )}
      {...containerProps}
    >
      <img
        src={imageSrc}
        alt={altImage}
        className="object-cover absolute inset-0 w-full h-full"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
};
