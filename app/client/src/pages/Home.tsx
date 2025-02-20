import { Typography } from '@/components/ui/typography';
import { useSession } from '@/hooks/useSession';

export const Home = () => {
  const { user } = useSession();

  return (
    <div className="size-full flex flex-col items-center justify-center gap-2">
      <Typography variant="h1">MATCHA</Typography>
      <Typography variant="lead">Connect as:</Typography>
      <div className="flex flex-col gap-2">
        {user &&
          Object.entries(user).map(([key, value]) => (
            <Typography key={key} variant="muted">
              {key}: {value}
            </Typography>
          ))}
      </div>
    </div>
  );
};
