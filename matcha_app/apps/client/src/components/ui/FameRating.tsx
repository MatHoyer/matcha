import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { ComponentProps } from 'react';

const HeartHalf: React.FC<ComponentProps<'svg'>> = ({
  className,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="24"
      viewBox="0 0 12 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={cn('lucide lucide-heart', className)}
      {...props}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
};

export const FameRating: React.FC<{ note: number }> = ({ note }) => {
  note = Math.min(5, note);
  const fullStars = Math.floor(note);
  const hasHalfStar = note % 1 !== 0;

  return (
    <div className="flex gap-0">
      {Array.from({ length: fullStars }, (_, index) => (
        <Heart key={index} fill="pink" color="pink" />
      ))}

      {hasHalfStar && (
        <div className="relative w-[24px]">
          <HeartHalf fill="pink" className="absolute" color="pink" />
          <HeartHalf className="absolute -scale-x-100 right-0" color="pink" />
        </div>
      )}

      {Array.from(
        { length: 5 - fullStars - (hasHalfStar ? 1 : 0) },
        (_, index) => (
          <Heart key={index + fullStars} color="pink" />
        )
      )}
    </div>
  );
};

export const FameSlider: React.FC<{
  value: number;
  onChange: (value: number) => void;
}> = ({ value, onChange }) => {
  const fullHeart = Math.floor(value);

  return (
    <div className="flex gap-0">
      {Array.from({ length: fullHeart }, (_, index) => (
        <Heart
          key={index}
          size={48}
          fill="pink"
          color="pink"
          className="cursor-pointer"
          onClick={() => onChange(index + 1)}
        />
      ))}

      {Array.from({ length: 5 - fullHeart }, (_, index) => (
        <Heart
          key={index + fullHeart}
          size={48}
          color="pink"
          className="cursor-pointer"
          onClick={() => onChange(index + fullHeart + 1)}
        />
      ))}
    </div>
  );
};
