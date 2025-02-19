import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ComponentProps } from 'react';
import { Button, ButtonProps } from './button';

export const AppLoader: React.FC<ComponentProps<typeof Loader2>> = ({
  className,
  ...props
}) => {
  return <Loader2 className={cn('animate-spin', className)} {...props} />;
};

export const LoadingButton = ({
  loading,
  children,
  className,
  ...props
}: ButtonProps & {
  loading?: boolean;
  success?: string;
}) => {
  return (
    <Button {...props} className={cn(className, 'relative')}>
      <motion.span
        className="flex items-center gap-1"
        animate={{
          opacity: loading ? 0 : 1,
          y: loading ? -10 : 0,
        }}
      >
        {children}
      </motion.span>
      <motion.span
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: loading ? 1 : 0,
          y: loading ? 0 : 10,
        }}
        exit={{
          opacity: 0,
          y: 10,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <AppLoader size={20} className="animate-spin" />
      </motion.span>
    </Button>
  );
};
