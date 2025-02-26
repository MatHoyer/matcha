import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';

export const Combobox: React.FC<{
  name: string;
  list: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  modal?: boolean;
}> = ({ name, list, value, onChange, modal }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? list.find((element) => element.value === value)?.label
            : `Select ${name}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${name}...`} />
          <CommandList>
            <CommandEmpty>No {name} found.</CommandEmpty>
            <CommandGroup>
              {list.map((element) => (
                <CommandItem
                  key={element.value}
                  value={element.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  {element.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === element.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const MultiCombobox: React.FC<{
  name: string;
  list: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  modal?: boolean;
}> = ({ name, list, value, onChange, modal }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] flex justify-between"
        >
          <p className="w-[calc(100%-20px)] truncate text-start">
            {value.length > 0
              ? value
                  .map(
                    (v) => list.find((element) => element.value === v)?.label
                  )
                  .join(', ')
              : `Select ${name}s...`}
          </p>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${name}s...`} />
          <CommandList>
            <CommandEmpty>No {name} found.</CommandEmpty>
            <CommandGroup>
              {list.map((element) => (
                <CommandItem
                  key={element.value}
                  value={element.value}
                  onSelect={(currentValue) => {
                    if (value.includes(currentValue)) {
                      onChange(value.filter((v) => v !== currentValue));
                    } else {
                      onChange([...value, currentValue]);
                    }
                  }}
                  className="cursor-pointer"
                >
                  {element.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value.some((v) => v === element.value)
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
