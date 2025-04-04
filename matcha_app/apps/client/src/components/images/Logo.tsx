import { cn } from '@/lib/utils';
import { useTheme } from '../theme/ThemeProvider';
import { ComponentProps } from 'react';

export const Logo: React.FC<{ size?: 'sm' } & ComponentProps<'button'>> = ({
  size,
  className,
  ...props
}) => {
  // const { theme } = useTheme();
  // const { theme = 'dark' } = useTheme() || {};
  // console.log('theme', theme);
  const { theme: rawTheme } = useTheme() || {};
  const theme = rawTheme === 'system' ? 'dark' : rawTheme || 'dark';

  if (size) {
    return (
      <button
        className={cn(
          'flex items-center justify-center cursor-pointer',
          size === 'sm' ? 'w-full max-w-[300px]' : 'w-[800px]',
          className
        )}
        {...props}
      >
        <img
          width={110}
          height={110}
          src={
            theme === 'dark'
              ? '/images/logo_small_Dark.png'
              : '/images/logo_small_Light.png'
          }
        />
      </button>
    );
  }

  return (
    <img width={120} height={120} src={'/images/logo_small.png'} alt="logo" />
  );
};
