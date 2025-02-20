import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

type SelectorProps = {
  value: string;
  onChange: (value: string) => void;
  list: string[];
  modal?: boolean;
};

const Selector: React.FC<SelectorProps> = ({
  value,
  onChange,
  list,
  modal,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover modal={modal} open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant={'outline'} className="w-full">
          {value}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div
          className={cn(
            list.length <= 5
              ? 'flex flex-col gap-2'
              : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
          )}
        >
          {list.map((element) => (
            <Button
              key={element}
              type="button"
              variant={value === element ? 'default' : 'outline'}
              onClick={() => {
                setIsOpen(false);
                onChange(element);
              }}
            >
              {element}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Selector;
