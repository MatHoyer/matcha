import { cn } from '@/lib/utils';
import { ComponentProps, PropsWithChildren } from 'react';

export const ImageContainer: React.FC<
  {
    imageSrc: string | null;
    altImage: string;
    size?: 'sm' | 'lg';
  } & ComponentProps<'div'> &
    PropsWithChildren
> = ({
  imageSrc,
  altImage,
  size = 'lg',
  className,
  children,
  ...containerProps
}) => {
  return (
    <div
      className={cn(
        className,
        size === 'sm' ? 'w-[90px]' : 'w-[200px]',
        'relative aspect-[3.6/4] overflow-hidden rounded-lg border bg-muted'
      )}
      {...containerProps}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={altImage}
          className="object-cover absolute inset-0 w-full h-full"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div className="absolute size-full inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};
