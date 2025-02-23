import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

export const Logo: React.FC<{ size?: 'sm' } & ComponentProps<'button'>> = ({
  size,
  className,
  ...props
}) => {
  if (size) {
    return (
      <button
        className={cn(
          'flex items-center cursor-pointer',
          size === 'sm' ? 'w-full max-w-[300px]' : 'w-[800px]',
          className
        )}
        {...props}
      >
        <img width={1100} height={220} src={'/logo.webp'} alt="logo" />
      </button>
    );
  }

  return <img width={1100} height={220} src={'/logo.webp'} alt="logo" />;
};
